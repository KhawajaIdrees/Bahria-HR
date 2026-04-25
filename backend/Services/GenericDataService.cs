using Microsoft.EntityFrameworkCore;
using FacultyInduction.Data;
using System.Linq.Expressions;

namespace FacultyInduction.Services
{
    /// <summary>
    /// Generic service for CRUD operations with upsert functionality
    /// </summary>
    public interface IGenericDataService
    {
        /// <summary>
        /// Upsert: Insert if not exists, update if exists
        /// </summary>
        Task<(bool Success, string Message, T? Data)> UpsertAsync<T>(T entity, Expression<Func<T, bool>> predicate) where T : class;
        
        /// <summary>Get by ID</summary>
        Task<T?> GetByIdAsync<T>(int id) where T : class;
        
        /// <summary>Get all records</summary>
        Task<List<T>> GetAllAsync<T>() where T : class;
        
        /// <summary>Get by predicate</summary>
        Task<T?> GetByPredicateAsync<T>(Expression<Func<T, bool>> predicate) where T : class;
        
        /// <summary>Delete by ID</summary>
        Task<(bool Success, string Message)> DeleteAsync<T>(int id) where T : class;
    }

    public class GenericDataService : IGenericDataService
    {
        private readonly ApplicationDbContext _context;

        public GenericDataService(ApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<(bool Success, string Message, T? Data)> UpsertAsync<T>(T entity, Expression<Func<T, bool>> predicate) where T : class
        {
            try
            {
                if (entity == null)
                    return (false, "Entity cannot be null", null);

                // Check if entity already exists
                var existing = await _context.Set<T>().FirstOrDefaultAsync(predicate);

                if (existing != null)
                {
                    // Update existing entity
                    var properties = typeof(T).GetProperties();
                    foreach (var property in properties)
                    {
                        // Skip primary key and navigation properties
                        if (property.Name.ToLower() == "id" || !property.CanRead || !property.CanWrite)
                            continue;

                        var newValue = property.GetValue(entity);
                        property.SetValue(existing, newValue);
                    }

                    _context.Set<T>().Update(existing);
                    await _context.SaveChangesAsync();
                    return (true, "Record updated successfully", existing);
                }
                else
                {
                    // Create new entity
                    _context.Set<T>().Add(entity);
                    await _context.SaveChangesAsync();
                    return (true, "Record created successfully", entity);
                }
            }
            catch (DbUpdateException ex)
            {
                return (false, $"Database validation error: {ex.InnerException?.Message ?? ex.Message}", null);
            }
            catch (Exception ex)
            {
                return (false, $"Error: {ex.Message}", null);
            }
        }

        public async Task<T?> GetByIdAsync<T>(int id) where T : class
        {
            try
            {
                return await _context.Set<T>().FindAsync(id);
            }
            catch (Exception ex)
            {
                throw new Exception($"Error retrieving record: {ex.Message}");
            }
        }

        public async Task<List<T>> GetAllAsync<T>() where T : class
        {
            try
            {
                return await _context.Set<T>().ToListAsync();
            }
            catch (Exception ex)
            {
                throw new Exception($"Error retrieving records: {ex.Message}");
            }
        }

        public async Task<T?> GetByPredicateAsync<T>(Expression<Func<T, bool>> predicate) where T : class
        {
            try
            {
                return await _context.Set<T>().FirstOrDefaultAsync(predicate);
            }
            catch (Exception ex)
            {
                throw new Exception($"Error retrieving record: {ex.Message}");
            }
        }

        public async Task<(bool Success, string Message)> DeleteAsync<T>(int id) where T : class
        {
            try
            {
                var entity = await _context.Set<T>().FindAsync(id);
                if (entity == null)
                    return (false, "Record not found");

                _context.Set<T>().Remove(entity);
                await _context.SaveChangesAsync();
                return (true, "Record deleted successfully");
            }
            catch (DbUpdateException ex)
            {
                return (false, $"Cannot delete: {ex.InnerException?.Message ?? ex.Message}");
            }
            catch (Exception ex)
            {
                return (false, $"Error: {ex.Message}");
            }
        }
    }
}
