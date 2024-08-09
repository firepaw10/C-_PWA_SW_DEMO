
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {   
        navigator.serviceWorker
        .register('/sw.js',   { scope: '/' }) // if the scope is not root '/', then the offline caching won't work!
        .then(registration => {
            console.log('Service Worker: Registered:', registration);
            if ('sync' in registration) {
                if ('serviceWorker' in navigator && 'SyncManager' in window) {
                    // Service worker and sync manager supported
                    console.log('Syncing is supported in this browser.');
                } else {
                    console.error('Background Sync not supported');
                }
                // this means internet connectivity has come back online.
                // interface with indexeddb
                
                //alert(emailField.value);
                window.addEventListener('online', async () => {
                    // let registration = await navigator.serviceWorker.getRegistration("/src/service_worker.j");
                    if (!registration) {
                        return;
                    }
                    registration.sync.register('formData')
                        .then((response) => {
                            console.log(`Sync event registered due to online event. Response: ${response}`);
                        })
                        .catch(err => {
                            console.error('Sync registration failed', err);
                        });
                });
                var form = document.querySelector('#mailing_list');
                var emailField = form.querySelector('#email');
                var nameField = form.querySelector('#Name');
                if (form == null || emailField == null) {
                    return;
                }
                form.addEventListener('submit', async function(event) {
                    event.preventDefault();
                    if (navigator.onLine) {
                        // handle s ubmit form as regular
                        form.submit();
                        // alert(data);
                      } else {
                        
                        var message = {
                            emailField: emailField.value,
                            nameField: nameField.value
                        };
                        var request = indexedDB.open('formDatabase', 1);

                        request.onupgradeneeded = function(event) {
                          console.log('Performing upgrade');
                          var db = event.target.result;
                          console.log('Creating object store');
                          db.createObjectStore('mystore', { autoIncrement: true });
                        
                        };
                        request.onsuccess = function(event) {
                            console.log('Connected to database');
                            var db = event.target.result;
                            var tx = db.transaction('mystore', 'readwrite');
                            var store = tx.objectStore('mystore');
                            console.log('Doing something with store "mystore"');
                            //const transaction = db.transaction(["name"], "readwrite");
                            // const objectStore = transaction.objectStore("name");
                            
                            var addRequest = store.add(message);
                            addRequest.onsuccess = function() {
                                console.log('Form data saved');
                            };
                            
                            tx.oncomplete = function() {
                                console.log('Transaction completed, closing database');
                                db.close();
                            };

                            tx.onerror = function() {
                                console.error('Transaction error, closing database', transaction.error);
                                db.close();
                            };

                            // registration.sync.register('formData')
                            //         .then(() => {
                            //             console.log('Sync event registered');
                            //         })
                            //         .catch(function(err) {
                            //             console.error('Sync registration failed', err);
                            //             form.submit(); // fallback to submit form
                            //         });
                          };
                          request.onerror = function(event) {
                            console.error('Error opening database', event);
                          };
                          emailField.value = '';
                          nameField.value = '';
                      }
                   
                });
                 // Listen for online event to sync data
                //  window.addEventListener('online', () => {
                //     registration.sync.register('formData')
                //         .then(() => {
                //             console.log('Sync event registered due to online event');
                //         })
                //         .catch(err => {
                //             console.error('Sync registration failed', err);
                //         });
                // });
            }
        })
        .catch(error => {
            console.error('Service worker registration failed:', error);
        });
    });
} else {
    console.log('Service worker is not supported in this browser.');
}
