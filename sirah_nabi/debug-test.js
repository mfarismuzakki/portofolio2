// Debug Test untuk Sirah App
// File ini untuk testing dan debug error yang mungkin terjadi

console.log('🔧 Starting debug test for Sirah App...');

// Test 0: Check if all database files are loaded
function testDatabaseFiles() {
    console.log('\n📚 Testing Database Files...');
    
    const databases = {
        'nabiPart1': window.nabiPart1,
        'nabiPart2': window.nabiPart2,
        'nabiPart3': window.nabiPart3,
        'nabiPart4': window.nabiPart4,
        'nabiPart5': window.nabiPart5,
        'nabiDisputed': window.nabiDisputed,
        'sahabatKhulafa': window.sahabatKhulafa,
        'sahabatAsharah': window.sahabatAsharah,
        'sahabatMuhajirinAnshar': window.sahabatMuhajirinAnshar,
        'sahabiyat': window.sahabiyat
    };
    
    let allLoaded = true;
    
    Object.entries(databases).forEach(([name, data]) => {
        if (data && Array.isArray(data) && data.length > 0) {
            console.log(`✅ ${name}: ${data.length} items loaded`);
        } else {
            console.error(`❌ ${name}: Not loaded or empty`);
            allLoaded = false;
        }
    });
    
    if (allLoaded) {
        console.log('✅ All database files loaded successfully');
    } else {
        console.error('🚨 Some database files failed to load!');
    }
    
    return allLoaded;
}

// Test 1: Check if all required elements exist
function testElementsExist() {
    console.log('\n📋 Testing DOM Elements...');
    
    const requiredElements = [
        'sirahGrid',
        'resultsInfo', 
        'resultsCount',
        'emptyState',
        'contentSection',
        'favoritesSection',
        'searchInput',
        'searchClear'
    ];
    
    const missingElements = [];
    
    requiredElements.forEach(id => {
        const element = document.getElementById(id);
        if (!element) {
            missingElements.push(id);
            console.error(`❌ Missing element: ${id}`);
        } else {
            console.log(`✅ Found element: ${id}`);
        }
    });
    
    if (missingElements.length > 0) {
        console.error(`🚨 Found ${missingElements.length} missing elements!`);
        return false;
    }
    
    console.log('✅ All required DOM elements found');
    return true;
}

// Test 2: Check filter tabs
function testFilterTabs() {
    console.log('\n🏷️ Testing Filter Tabs...');
    
    const filterTabs = document.querySelectorAll('.filter-tab');
    console.log(`Found ${filterTabs.length} filter tabs`);
    
    const expectedFilters = ['all', 'nabi', 'khulafaur-rasyidin', 'sahabat', 'sahabat-wanita'];
    const foundFilters = [];
    
    filterTabs.forEach(tab => {
        const filter = tab.getAttribute('data-filter');
        foundFilters.push(filter);
        console.log(`📄 Filter tab: ${filter}`);
    });
    
    expectedFilters.forEach(expected => {
        if (!foundFilters.includes(expected)) {
            console.error(`❌ Missing filter tab: ${expected}`);
        } else {
            console.log(`✅ Found filter tab: ${expected}`);
        }
    });
    
    return foundFilters.length > 0;
}

// Test 3: Check navigation items
function testNavigation() {
    console.log('\n🧭 Testing Navigation...');
    
    const navItems = document.querySelectorAll('.nav-item');
    console.log(`Found ${navItems.length} navigation items`);
    
    navItems.forEach(nav => {
        const section = nav.getAttribute('data-section');
        console.log(`🔗 Nav item: ${section}`);
    });
    
    return navItems.length > 0;
}

// Test 4: Check global data availability
function testDataAvailability() {
    console.log('\n📊 Testing Data Availability...');
    
    const dataChecks = [
        { name: 'nabiPart1', data: window.nabiPart1 },
        { name: 'nabiPart2', data: window.nabiPart2 },
        { name: 'sahabatKhulafa', data: window.sahabatKhulafa },
        { name: 'sahabatAsharah', data: window.sahabatAsharah },
        { name: 'sahabiyat', data: window.sahabiyat },
        { name: 'SirahCacheManager', data: window.SirahCacheManager }
    ];
    
    dataChecks.forEach(check => {
        if (check.data) {
            const length = Array.isArray(check.data) ? check.data.length : 'available';
            console.log(`✅ ${check.name}: ${length}`);
        } else {
            console.warn(`⚠️ ${check.name}: not available`);
        }
    });
}

// Test 5: Simulate click on filter tabs
function testFilterClicks() {
    console.log('\n🖱️ Testing Filter Clicks...');
    
    const filterTabs = document.querySelectorAll('.filter-tab');
    
    filterTabs.forEach((tab, index) => {
        try {
            const filter = tab.getAttribute('data-filter');
            console.log(`Testing click on ${filter}...`);
            
            // Simulate click
            tab.click();
            
            console.log(`✅ Successfully clicked ${filter}`);
        } catch (error) {
            console.error(`❌ Error clicking filter ${index}:`, error);
        }
    });
}

// Test 6: Check app initialization
function testAppInitialization() {
    console.log('\n🚀 Testing App Initialization...');
    
    if (window.app) {
        console.log('✅ SirahApp instance found');
        console.log('📊 App state:', {
            currentFilter: window.app.currentFilter,
            currentSection: window.app.currentSection,
            cacheManager: !!window.app.cacheManager,
            loadedDataSizes: {
                nabi: window.app.loadedData?.nabi?.length || 0,
                sahabat: window.app.loadedData?.sahabat?.length || 0,
                sahabiyat: window.app.loadedData?.sahabiyat?.length || 0
            }
        });
    } else {
        console.error('❌ SirahApp instance not found');
    }
}

// Run all tests when page loads
document.addEventListener('DOMContentLoaded', function() {
    console.log('📋 DOM Content Loaded - Running debug tests...');
    
    setTimeout(() => {
        testDatabaseFiles();
        testElementsExist();
        testFilterTabs();
        testNavigation();
        testDataAvailability();
        testAppInitialization();
        
        console.log('\n🎯 Debug tests completed. Check results above.');
        
        // Optional: Test filter clicks after a delay
        setTimeout(() => {
            testFilterClicks();
        }, 2000);
        
    }, 1000);
});

// Export for manual testing
window.debugTests = {
    testDatabaseFiles,
    testElementsExist,
    testFilterTabs,
    testNavigation,
    testDataAvailability,
    testFilterClicks,
    testAppInitialization
};

console.log('🔧 Debug test script loaded. Tests will run automatically after DOM loads.');
console.log('💡 You can also run individual tests manually using window.debugTests.testName()');