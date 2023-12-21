namespace Services;

public interface IEmailService
{
    void SendEmail(Message message);
}