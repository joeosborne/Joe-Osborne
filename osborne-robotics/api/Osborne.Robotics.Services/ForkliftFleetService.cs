namespace Osborne.Robotics.Services
{
    public class ForkliftFleetService : IForkliftFleetService
    {
        private readonly IForkliftRepository _forkliftRepository;

        // TODO: Improve guard checks for input parameters - maybe using Fluent Validation

        public ForkliftFleetService(IForkliftRepository forkliftRepository)
        {
            _forkliftRepository = forkliftRepository ?? throw new ArgumentNullException(nameof(forkliftRepository));
            // TODO: Replace fake data if an existing data store/set is available on startup
            _forkliftRepository.ReplaceFleetAsync(BuildFakeForkliftData());
        }

        public async Task<IList<Forklift>> GetForkliftFleet()
        {
            var response = await _forkliftRepository.GetAllAsync();
            return response.Select(CalculateForkliftAge).ToList();
        }

        public Task<bool> ReplaceForkliftFleet(IList<Forklift> fleet)
        {
            if (fleet == null || !fleet.Any())
            {
                throw new ArgumentException("Fleet cannot be null or empty.", nameof(fleet));
            }

            return _forkliftRepository.ReplaceFleetAsync(fleet);
        }

        private static Forklift CalculateForkliftAge(Forklift forklift)
        {
            if (forklift == null) throw new ArgumentNullException(nameof(forklift));
            
            forklift.Age = DateTime.Today.Year - forklift.ManufacturingDate.Year;
            return forklift;
        }

        private static List<Forklift> BuildFakeForkliftData()
        {
            return
            [
                new("1428 Forklift A", "Model-123", new DateOnly(2022, 1, 11)),
                new("Forklift B", "Model-234", new DateOnly(2018, 5, 12)),
                new("Forklift C", "Model-345", new DateOnly(2021, 6, 4)),
                new("Forklift YADA", "Model-345", new DateOnly(2024, 1, 15)),
                new("Forklift D", "Model-456", new DateOnly(2017, 10, 30))
            ];
        }
    }
}
