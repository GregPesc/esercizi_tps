using System.Net;
using System.Net.Sockets;
using System.Text;

class TcpServer
{

    public static void Start()
    {
        const int port = 8888;
        TcpListener server = new TcpListener(IPAddress.Any, port);
        server.Start();
        Console.WriteLine($"Server in ascolto su porta {port}...");

        while (true)
        {
            TcpClient client = server.AcceptTcpClient();
            Console.WriteLine("Client connesso.");
            Thread clientThread = new Thread(HandleClient);
            clientThread.Start(client);
        }
    }

    private static void HandleClient(object obj)
    {

        using (TcpClient client = (TcpClient)obj)
        using (NetworkStream stream = client.GetStream())
        {
            byte[] buffer = new byte[1024];
            int bytesRead;

            while ((bytesRead = stream.Read(buffer, 0, buffer.Length)) != 0)
            {
                string data = Encoding.UTF8.GetString(buffer, 0, bytesRead);
                Console.WriteLine($"Ricevuto: {data}");

                // Echo del messaggio
                byte[] response = Encoding.UTF8.GetBytes(data);
                stream.Write(response, 0, response.Length);
            }
        }
    }
}



class Program
{
    public static void Main()
    {
        TcpServer.Start();
    }
}
