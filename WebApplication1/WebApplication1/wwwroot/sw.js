const cacheName = 'v2';
const cacheAssets = [
    '/',
    '/home/index',
    '/home/privacy',
    '/css/site.css',
    '/js/main.js',
    '/js/site.js'
];

self.addEventListener('install', (event) => {
    console.log('Service Worker: Installed.');
    event.waitUntil(
        caches
          .open(cacheName)
          .then(cache => {
            console.log('Service Worker: Caching Files');
            cache.addAll(cacheAssets);
          })
          .then(() => self.skipWaiting())
    );
});

self.addEventListener('activate', (event) => {
    console.log('Service Worker: Activated');
    event.waitUntil(
        caches.keys().then(cacheNames => {
            return Promise.all(
                cacheNames.map(cache => {
                    if(cache !== cacheName) {
                        console.log('Service Worker: Clearing Old Cache');
                        return caches.delete(cache);
                    }
                })
            )
        })
        .then(() => self.skipWaiting())
    )
    clients.claim();
});



// Call Fetch Event
self.addEventListener('fetch', (event) => {
    console.log('Service Worker: Fetching');
    event.respondWith(
     fetch(event.request)
     .then(res => {
        const resClone = res.clone();

        caches.open(cacheName)
           .then(cache => {
            cache.put(event.request, resClone);
           });
        return res;
     }).catch(() => caches.match(event.request).then(res => res))
    
    );
});



self.addEventListener('sync', (event) => {
    console.log('Service Worker: Sync event fired:', event);
    if (event.tag === 'formData') {
        console.log('Service Worker: Sync event with tag "formData"');
        event.waitUntil(syncFormData());
    }
});


async function syncFormData() {
    return new Promise((resolve, reject) => {
        var request = indexedDB.open('formDatabase', 1);
        // loop over all stored form submissions and make api calls now, since the client has re-connected to the internet at this point.
        request.onsuccess = function(event) {
            var db = event.target.result;
            var transaction = db.transaction('mystore', 'readonly');
            var store = transaction.objectStore('mystore');
            var getAllRequest = store.getAll();
            // If the code dnever hits the sync listener here, manually unregister the Service Worker from the Developer tools and refresh.
            getAllRequest.onsuccess = function() {
                var messages = getAllRequest.result;
                if (messages.length > 0) {
                    console.log(messages[0]);
                    Promise.all(messages.map(message => {
                        return fetch('/api/submit', {
                            method: 'POST',
                            body: JSON.stringify(message),
                            headers: { 'Content-Type': 'application/json' }
                        }).then(response => {
                            if (response.ok) {
                                var deleteTransaction = db.transaction('mystore', 'readwrite');
                                var deleteStore = deleteTransaction.objectStore('mystore');
                                return deleteStore.delete(message.id);
                            } else {
                                console.error('Error submitting form data', response.statusText);
                                throw new Error('Submission failed');
                            }
                        }).catch(error => {
                            console.error('Network error', error);
                            throw error;
                        });
                    })).then(() => {
                        resolve();
                    }).catch(() => {
                        reject();
                    });
                } else {
                    resolve();
                }
            };

            getAllRequest.onerror = function() {
                console.error('Error getting all messages', getAllRequest.error);
                reject(getAllRequest.error);
            };

            transaction.oncomplete = function() {
                db.close();
            };
        };

        request.onerror = function(event) {
            console.error('Error opening database', event);
            reject(event);
        };
    });
}

