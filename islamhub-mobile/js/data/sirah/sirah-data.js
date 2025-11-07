// Database Utama Sirah Nabi-Nabi dan Sahabat
// Menggabungkan data dari nabi-data.js dan sahabat-data.js

// Load data dari file terpisah
let sirahDatabase = [];

// Gabungkan semua database
if (typeof nabiDatabase !== 'undefined') {
    sirahDatabase = [...sirahDatabase, ...nabiDatabase];
}

if (typeof disputedProphets !== 'undefined') {
    sirahDatabase = [...sirahDatabase, ...disputedProphets];
}

if (typeof sahabatDatabase !== 'undefined') {
    sirahDatabase = [...sirahDatabase, ...sahabatDatabase];
}

// Helper functions untuk pencarian dan filter
const searchDatabase = (query, filter = 'all') => {
    let filtered = sirahDatabase;
    
    // Filter berdasarkan kategori
    if (filter !== 'all') {
        filtered = filtered.filter(person => {
            switch (filter) {
                case 'nabi':
                    return person.category === 'nabi';
                case 'sahabat':
                    return person.category === 'sahabat';
                default:
                    return true;
            }
        });
    }
    
    // Search berdasarkan query
    if (query && query.trim() !== '') {
        const searchTerm = query.toLowerCase();
        filtered = filtered.filter(person => 
            person.name.toLowerCase().includes(searchTerm) ||
            person.title.toLowerCase().includes(searchTerm) ||
            person.biography.toLowerCase().includes(searchTerm) ||
            (person.arabicName && person.arabicName.includes(searchTerm))
        );
    }
    
    return filtered;
};

const getPersonById = (id) => {
    return sirahDatabase.find(person => person.id === id);
};

// Export untuk penggunaan di file lain
export { sirahDatabase, searchDatabase, getPersonById };