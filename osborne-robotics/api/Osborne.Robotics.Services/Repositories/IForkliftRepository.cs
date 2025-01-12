
// TODO: IForkliftRepository provides an abstraction. For now, InMemoryForkliftRepository is used by this could
// be replaced with a different implementation for SQL Server or any other data storage.
public interface IForkliftRepository
{
    Task<bool> CreateAsync(Forklift forklift);

    Task<bool> ReplaceFleetAsync(IList<Forklift> forklifts);

    Task<Forklift?> GetByModelNumberAsync(string modelNumber);
    
    Task<IEnumerable<Forklift>> GetAllAsync();
}
