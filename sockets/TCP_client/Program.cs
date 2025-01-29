using System.Net.Sockets;
using System.Text;

class TcpClientExample
{
    public static void Start()
    {
        using (TcpClient client = new TcpClient("127.0.0.1", 8888))
        using (NetworkStream stream = client.GetStream())
        {
            Console.WriteLine("Messaggio da inviare: ");
            string message = Console.ReadLine() ?? "Hello, world!";
            byte[] data = Encoding.UTF8.GetBytes(message);

            stream.Write(data, 0, data.Length);
            Console.WriteLine($"Inviato: {message}");

            byte[] buffer = new byte[1024];
            int bytesRead = stream.Read(buffer, 0, buffer.Length);
            string response = Encoding.UTF8.GetString(buffer, 0, bytesRead);
            Console.WriteLine($"Ricevuto: {response}");
        }
    }
}



class Program
{
    public static void Main()
    {
        TcpClientExample.Start();
    }
}