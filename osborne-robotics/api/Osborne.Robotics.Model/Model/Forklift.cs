public class Forklift(string Name, string ModelNumber, DateOnly ManufacturingDate)
{
    public int Age { get; set; }
    public string Name { get; } = Name;
    public string ModelNumber { get; } = ModelNumber;
    public DateOnly ManufacturingDate { get; } = ManufacturingDate;
}
