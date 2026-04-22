using System;

namespace FacultyInduction.Utilities
{
    public static class CodeGeneratorUtility
    {
        private static readonly Random _random = new Random();

        /// <summary>
        /// Generates a random 6-digit code
        /// </summary>
        /// <returns>A string containing 6 random digits</returns>
        public static string Generate6DigitCode()
        {
            return _random.Next(100000, 999999).ToString();
        }
    }
}
