namespace Osborne.Robotics.Services
{
    public interface IForkliftFleetService
    {
        Task<IList<Forklift>> GetForkliftFleet();

        Task<bool> ReplaceForkliftFleet(IList<Forklift> fleet);
    }
}