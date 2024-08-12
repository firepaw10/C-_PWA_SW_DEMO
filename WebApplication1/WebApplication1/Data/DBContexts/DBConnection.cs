using System;
using System.Data.SqlClient;


namespace WebApplication1.Data.DBContexts.DBConnection {

    public class DBConn {

        // Main Method
        public void Main() 
        {
            Connect();
            //Console.ReadKey();
        }

        public String Insert_Email(String Name, String Email) 
        {
            string constr;

            SqlConnection conn;
            constr  = @"Data Source=(localdb)\MSSQLLocalDB;Initial Catalog=myWebApp;Trusted_Connection=True;";
            conn = new SqlConnection(constr);
            // to open the connection
            conn.Open(); 
    
            Console.WriteLine("Connection Open!");

            // test a select query;
            SqlCommand cmd;
            SqlDataReader dreader;
            string sql, output = "";
            // sql = "Select * from information_schema.tables;";
            DateTime localDate = DateTime.Now;
            String curTime = localDate.ToString("dd/MM/yyyy HH:mm:ss");
            sql = $"INSERT INTO dbo.emailList(NAME, EMAIL, TIME_JOINED) VALUES ('{Name}', '{Email}', '{curTime}');";
            cmd = new SqlCommand(sql, conn);
            dreader = cmd.ExecuteReader();
            while (dreader.Read()) 
            {
                output = output + dreader.GetValue(0) + " - "  + dreader.GetValue(1) + "\n";
            }
            Console.Write(output);
            dreader.Close();
            cmd.Dispose();  
            // to close the connection
            conn.Close(); 
            return output;
        }

        public static void Connect()
        {
            string constr;

            SqlConnection conn;
            constr  = @"Data Source=(localdb)\MSSQLLocalDB;Initial Catalog=myWebApp;Trusted_Connection=True;";
            conn = new SqlConnection(constr);
            // to open the connection
            conn.Open(); 
    
            Console.WriteLine("Connection Open!");

            // test a select query;
            SqlCommand cmd;
            SqlDataReader dreader;
            string sql, output = "";
            // sql = "Select * from information_schema.tables;";
            sql = "Select * from myWebApp.dbo.emailList;";
            cmd = new SqlCommand(sql, conn);
            dreader = cmd.ExecuteReader();
            while (dreader.Read()) 
            {
                output = output + dreader.GetValue(0) + " - "  + dreader.GetValue(1) + "\n";
            }
            Console.Write(output);
            dreader.Close();
            cmd.Dispose();  
            // to close the connection
            conn.Close(); 
    
        }
    }
}