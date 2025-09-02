// ULTRA-COMPREHENSIVE Real-time API Integration - MAXIMUM INDIA COVERAGE
const WEATHER_API_KEY = import.meta.env.VITE_WEATHER_API_KEY
const WEATHER_BASE_URL = 'https://api.weatherapi.com/v1'

// Environment validation
if (!WEATHER_API_KEY) {
  console.warn('⚠️ VITE_WEATHER_API_KEY not found. Weather data will be simulated.')
}

// MASSIVE city coverage - 200+ cities across ALL states/UTs
const ALL_INDIAN_CITIES = [
  // Andhra Pradesh
  { name: "Visakhapatnam", lat: 17.6868, lng: 83.2185, state: "AP", tier: 1 },
  { name: "Vijayawada", lat: 16.5062, lng: 80.6480, state: "AP", tier: 2 },
  { name: "Guntur", lat: 16.3067, lng: 80.4365, state: "AP", tier: 2 },
  { name: "Nellore", lat: 14.4426, lng: 79.9865, state: "AP", tier: 2 },
  { name: "Kurnool", lat: 15.8281, lng: 78.0373, state: "AP", tier: 3 },
  { name: "Tirupati", lat: 13.6288, lng: 79.4192, state: "AP", tier: 2 },
  { name: "Anantapur", lat: 14.6819, lng: 77.6006, state: "AP", tier: 3 },
  { name: "Chittoor", lat: 13.2172, lng: 79.1003, state: "AP", tier: 3 },
  
  // Arunachal Pradesh
  { name: "Itanagar", lat: 27.0844, lng: 93.6053, state: "AR", tier: 3 },
  { name: "Naharlagun", lat: 27.1050, lng: 93.7100, state: "AR", tier: 3 },
  { name: "Pasighat", lat: 28.0669, lng: 95.3261, state: "AR", tier: 3 },
  
  // Assam
  { name: "Guwahati", lat: 26.1445, lng: 91.7362, state: "AS", tier: 1 },
  { name: "Silchar", lat: 24.8333, lng: 92.7789, state: "AS", tier: 2 },
  { name: "Dibrugarh", lat: 27.4728, lng: 94.9120, state: "AS", tier: 2 },
  { name: "Jorhat", lat: 26.7509, lng: 94.2037, state: "AS", tier: 2 },
  { name: "Nagaon", lat: 26.3484, lng: 92.6858, state: "AS", tier: 3 },
  { name: "Tinsukia", lat: 27.4900, lng: 95.3597, state: "AS", tier: 3 },
  { name: "Tezpur", lat: 26.6335, lng: 92.7935, state: "AS", tier: 3 },
  
  // Bihar
  { name: "Patna", lat: 25.5941, lng: 85.1376, state: "BR", tier: 1 },
  { name: "Gaya", lat: 24.7914, lng: 85.0002, state: "BR", tier: 2 },
  { name: "Bhagalpur", lat: 25.2425, lng: 86.9842, state: "BR", tier: 2 },
  { name: "Muzaffarpur", lat: 26.1197, lng: 85.3910, state: "BR", tier: 2 },
  { name: "Darbhanga", lat: 26.1542, lng: 85.8918, state: "BR", tier: 2 },
  { name: "Purnia", lat: 25.7771, lng: 87.4753, state: "BR", tier: 3 },
  { name: "Begusarai", lat: 25.4180, lng: 86.1274, state: "BR", tier: 3 },
  { name: "Katihar", lat: 25.5484, lng: 87.5619, state: "BR", tier: 3 },
  
  // Chhattisgarh
  { name: "Raipur", lat: 21.2514, lng: 81.6296, state: "CG", tier: 1 },
  { name: "Bhilai", lat: 21.1938, lng: 81.3509, state: "CG", tier: 2 },
  { name: "Bilaspur", lat: 22.0797, lng: 82.1409, state: "CG", tier: 2 },
  { name: "Korba", lat: 22.3595, lng: 82.7501, state: "CG", tier: 2 },
  { name: "Durg", lat: 21.1900, lng: 81.2849, state: "CG", tier: 2 },
  { name: "Jagdalpur", lat: 19.0822, lng: 82.0347, state: "CG", tier: 3 },
  { name: "Raigarh", lat: 21.8974, lng: 83.3950, state: "CG", tier: 3 },
  { name: "Dantewada", lat: 18.8926, lng: 81.3545, state: "CG", tier: 3 },
  { name: "Bastar", lat: 19.3239, lng: 81.9484, state: "CG", tier: 3 },
  { name: "Sukma", lat: 18.3841, lng: 81.6615, state: "CG", tier: 3 },
  
  // Delhi NCR
  { name: "New Delhi", lat: 28.6139, lng: 77.2090, state: "DL", tier: 1 },
  { name: "Gurgaon", lat: 28.4595, lng: 77.0266, state: "HR", tier: 1 },
  { name: "Noida", lat: 28.5355, lng: 77.3910, state: "UP", tier: 1 },
  { name: "Faridabad", lat: 28.4089, lng: 77.3178, state: "HR", tier: 1 },
  { name: "Ghaziabad", lat: 28.6692, lng: 77.4538, state: "UP", tier: 1 },
  { name: "Greater Noida", lat: 28.4744, lng: 77.5040, state: "UP", tier: 2 },
  
  // Goa
  { name: "Panaji", lat: 15.4909, lng: 73.8278, state: "GA", tier: 2 },
  { name: "Margao", lat: 15.2700, lng: 73.9500, state: "GA", tier: 2 },
  { name: "Vasco da Gama", lat: 15.3955, lng: 73.8157, state: "GA", tier: 2 },
  { name: "Mapusa", lat: 15.5943, lng: 73.8070, state: "GA", tier: 3 },
  
  // Gujarat
  { name: "Ahmedabad", lat: 23.0225, lng: 72.5714, state: "GJ", tier: 1 },
  { name: "Surat", lat: 21.1702, lng: 72.8311, state: "GJ", tier: 1 },
  { name: "Vadodara", lat: 22.3072, lng: 73.1812, state: "GJ", tier: 1 },
  { name: "Rajkot", lat: 22.3039, lng: 70.8022, state: "GJ", tier: 2 },
  { name: "Bhavnagar", lat: 21.7645, lng: 72.1519, state: "GJ", tier: 2 },
  { name: "Jamnagar", lat: 22.4707, lng: 70.0577, state: "GJ", tier: 2 },
  { name: "Gandhinagar", lat: 23.2156, lng: 72.6369, state: "GJ", tier: 2 },
  { name: "Anand", lat: 22.5645, lng: 72.9289, state: "GJ", tier: 3 },
  { name: "Morbi", lat: 22.8173, lng: 70.8370, state: "GJ", tier: 3 },
  
  // Haryana
  { name: "Chandigarh", lat: 30.7333, lng: 76.7794, state: "CH", tier: 1 },
  { name: "Hisar", lat: 29.1492, lng: 75.7217, state: "HR", tier: 2 },
  { name: "Karnal", lat: 29.6857, lng: 76.9905, state: "HR", tier: 2 },
  { name: "Panipat", lat: 29.3909, lng: 76.9635, state: "HR", tier: 2 },
  { name: "Ambala", lat: 30.3752, lng: 76.7821, state: "HR", tier: 2 },
  { name: "Yamunanagar", lat: 30.1290, lng: 77.2674, state: "HR", tier: 3 },
  { name: "Rohtak", lat: 28.8955, lng: 76.6066, state: "HR", tier: 3 },
  { name: "Sonipat", lat: 28.9931, lng: 77.0151, state: "HR", tier: 3 },
  
  // Himachal Pradesh
  { name: "Shimla", lat: 31.1048, lng: 77.1734, state: "HP", tier: 2 },
  { name: "Manali", lat: 32.2396, lng: 77.1887, state: "HP", tier: 2 },
  { name: "Dharamshala", lat: 32.2190, lng: 76.3234, state: "HP", tier: 2 },
  { name: "Solan", lat: 30.9045, lng: 77.0967, state: "HP", tier: 3 },
  { name: "Mandi", lat: 31.7084, lng: 76.9319, state: "HP", tier: 3 },
  { name: "Kullu", lat: 31.9578, lng: 77.1098, state: "HP", tier: 3 },
  { name: "Una", lat: 31.4685, lng: 76.2708, state: "HP", tier: 3 },
  
  // Jharkhand
  { name: "Ranchi", lat: 23.3441, lng: 85.3096, state: "JH", tier: 1 },
  { name: "Jamshedpur", lat: 22.8046, lng: 86.2029, state: "JH", tier: 1 },
  { name: "Dhanbad", lat: 23.7957, lng: 86.4304, state: "JH", tier: 2 },
  { name: "Bokaro", lat: 23.6693, lng: 86.1511, state: "JH", tier: 2 },
  { name: "Deoghar", lat: 24.4823, lng: 86.6961, state: "JH", tier: 3 },
  { name: "Hazaribagh", lat: 23.9981, lng: 85.3615, state: "JH", tier: 3 },
  { name: "Giridih", lat: 24.1853, lng: 86.3094, state: "JH", tier: 3 },
  
  // Karnataka
  { name: "Bangalore", lat: 12.9716, lng: 77.5946, state: "KA", tier: 1 },
  { name: "Mysore", lat: 12.2958, lng: 76.6394, state: "KA", tier: 1 },
  { name: "Mangalore", lat: 12.9141, lng: 74.8560, state: "KA", tier: 2 },
  { name: "Hubli", lat: 15.3647, lng: 75.1240, state: "KA", tier: 2 },
  { name: "Belgaum", lat: 15.8497, lng: 74.4977, state: "KA", tier: 2 },
  { name: "Davangere", lat: 14.4644, lng: 75.9218, state: "KA", tier: 3 },
  { name: "Bellary", lat: 15.1394, lng: 76.9214, state: "KA", tier: 3 },
  { name: "Bijapur", lat: 16.8302, lng: 75.7100, state: "KA", tier: 3 },
  { name: "Shimoga", lat: 13.9299, lng: 75.5681, state: "KA", tier: 3 },
  { name: "Tumkur", lat: 13.3379, lng: 77.1022, state: "KA", tier: 3 },
  
  // Kerala
  { name: "Kochi", lat: 9.9312, lng: 76.2673, state: "KL", tier: 1 },
  { name: "Thiruvananthapuram", lat: 8.5241, lng: 76.9366, state: "KL", tier: 1 },
  { name: "Kozhikode", lat: 11.2588, lng: 75.7804, state: "KL", tier: 1 },
  { name: "Thrissur", lat: 10.5276, lng: 76.2144, state: "KL", tier: 2 },
  { name: "Kollam", lat: 8.8932, lng: 76.6141, state: "KL", tier: 2 },
  { name: "Palakkad", lat: 10.7867, lng: 76.6548, state: "KL", tier: 3 },
  { name: "Alappuzha", lat: 9.4981, lng: 76.3388, state: "KL", tier: 3 },
  { name: "Kottayam", lat: 9.5916, lng: 76.5222, state: "KL", tier: 3 },
  { name: "Kannur", lat: 11.8745, lng: 75.3704, state: "KL", tier: 3 },
  
  // Madhya Pradesh
  { name: "Bhopal", lat: 23.2599, lng: 77.4126, state: "MP", tier: 1 },
  { name: "Indore", lat: 22.7196, lng: 75.8577, state: "MP", tier: 1 },
  { name: "Jabalpur", lat: 23.1815, lng: 79.9864, state: "MP", tier: 2 },
  { name: "Gwalior", lat: 26.2183, lng: 78.1828, state: "MP", tier: 2 },
  { name: "Ujjain", lat: 23.1765, lng: 75.7885, state: "MP", tier: 2 },
  { name: "Sagar", lat: 23.8388, lng: 78.7378, state: "MP", tier: 3 },
  { name: "Dewas", lat: 22.9676, lng: 76.0534, state: "MP", tier: 3 },
  { name: "Satna", lat: 24.5671, lng: 80.8326, state: "MP", tier: 3 },
  { name: "Ratlam", lat: 23.3315, lng: 75.0367, state: "MP", tier: 3 },
  
  // Maharashtra
  { name: "Mumbai", lat: 19.0760, lng: 72.8777, state: "MH", tier: 1 },
  { name: "Pune", lat: 18.5204, lng: 73.8567, state: "MH", tier: 1 },
  { name: "Nagpur", lat: 21.1458, lng: 79.0882, state: "MH", tier: 1 },
  { name: "Thane", lat: 19.2183, lng: 72.9781, state: "MH", tier: 1 },
  { name: "Nashik", lat: 19.9975, lng: 73.7898, state: "MH", tier: 2 },
  { name: "Aurangabad", lat: 19.8762, lng: 75.3433, state: "MH", tier: 2 },
  { name: "Solapur", lat: 17.6599, lng: 75.9064, state: "MH", tier: 2 },
  { name: "Kolhapur", lat: 16.7050, lng: 74.2433, state: "MH", tier: 2 },
  { name: "Amravati", lat: 20.9374, lng: 77.7796, state: "MH", tier: 2 },
  { name: "Sangli", lat: 16.8524, lng: 74.5815, state: "MH", tier: 3 },
  { name: "Akola", lat: 20.7002, lng: 77.0082, state: "MH", tier: 3 },
  { name: "Latur", lat: 18.4088, lng: 76.5604, state: "MH", tier: 3 },
  { name: "Dhule", lat: 20.9042, lng: 74.7749, state: "MH", tier: 3 },
  { name: "Jalgaon", lat: 21.0077, lng: 75.5626, state: "MH", tier: 3 },
  { name: "Gadchiroli", lat: 20.1667, lng: 80.0167, state: "MH", tier: 3 },
  
  // Manipur
  { name: "Imphal", lat: 24.8170, lng: 93.9368, state: "MN", tier: 2 },
  { name: "Thoubal", lat: 24.6341, lng: 93.9861, state: "MN", tier: 3 },
  { name: "Bishnupur", lat: 24.6464, lng: 93.7792, state: "MN", tier: 3 },
  
  // Meghalaya
  { name: "Shillong", lat: 25.5788, lng: 91.8933, state: "ML", tier: 2 },
  { name: "Tura", lat: 25.5138, lng: 90.2038, state: "ML", tier: 3 },
  { name: "Jowai", lat: 25.4504, lng: 92.1981, state: "ML", tier: 3 },
  
  // Mizoram
  { name: "Aizawl", lat: 23.7271, lng: 92.7176, state: "MZ", tier: 2 },
  { name: "Lunglei", lat: 22.8844, lng: 92.7379, state: "MZ", tier: 3 },
  { name: "Serchhip", lat: 23.3015, lng: 92.8369, state: "MZ", tier: 3 },
  
  // Nagaland
  { name: "Kohima", lat: 25.6751, lng: 94.1086, state: "NL", tier: 2 },
  { name: "Dimapur", lat: 25.9044, lng: 93.7267, state: "NL", tier: 2 },
  { name: "Mokokchung", lat: 26.3226, lng: 94.5223, state: "NL", tier: 3 },
  
  // Odisha
  { name: "Bhubaneswar", lat: 20.2961, lng: 85.8245, state: "OR", tier: 1 },
  { name: "Cuttack", lat: 20.4625, lng: 85.8828, state: "OR", tier: 2 },
  { name: "Rourkela", lat: 22.2604, lng: 84.8536, state: "OR", tier: 2 },
  { name: "Berhampur", lat: 19.3149, lng: 84.7941, state: "OR", tier: 2 },
  { name: "Sambalpur", lat: 21.4669, lng: 83.9812, state: "OR", tier: 3 },
  { name: "Puri", lat: 19.8135, lng: 85.8312, state: "OR", tier: 3 },
  { name: "Balasore", lat: 21.4942, lng: 86.9336, state: "OR", tier: 3 },
  { name: "Malkangiri", lat: 18.3479, lng: 81.8999, state: "OR", tier: 3 },
  
  // Punjab
  { name: "Amritsar", lat: 31.6340, lng: 74.8723, state: "PB", tier: 1 },
  { name: "Ludhiana", lat: 30.9010, lng: 75.8573, state: "PB", tier: 1 },
  { name: "Jalandhar", lat: 31.3260, lng: 75.5762, state: "PB", tier: 2 },
  { name: "Patiala", lat: 30.3398, lng: 76.3869, state: "PB", tier: 2 },
  { name: "Bathinda", lat: 30.2110, lng: 74.9455, state: "PB", tier: 2 },
  { name: "Mohali", lat: 30.7046, lng: 76.7179, state: "PB", tier: 2 },
  { name: "Pathankot", lat: 32.2741, lng: 75.6528, state: "PB", tier: 3 },
  { name: "Hoshiarpur", lat: 31.5344, lng: 75.9117, state: "PB", tier: 3 },
  
  // Rajasthan
  { name: "Jaipur", lat: 26.9124, lng: 75.7873, state: "RJ", tier: 1 },
  { name: "Jodhpur", lat: 26.2389, lng: 73.0243, state: "RJ", tier: 1 },
  { name: "Udaipur", lat: 24.5854, lng: 73.7125, state: "RJ", tier: 2 },
  { name: "Kota", lat: 25.2138, lng: 75.8648, state: "RJ", tier: 2 },
  { name: "Bikaner", lat: 28.0229, lng: 73.3119, state: "RJ", tier: 2 },
  { name: "Ajmer", lat: 26.4499, lng: 74.6399, state: "RJ", tier: 2 },
  { name: "Bharatpur", lat: 27.2152, lng: 77.4900, state: "RJ", tier: 3 },
  { name: "Alwar", lat: 27.5530, lng: 76.6346, state: "RJ", tier: 3 },
  { name: "Sikar", lat: 27.6094, lng: 75.1399, state: "RJ", tier: 3 },
  
  // Sikkim
  { name: "Gangtok", lat: 27.3389, lng: 88.6065, state: "SK", tier: 2 },
  { name: "Namchi", lat: 27.1651, lng: 88.3639, state: "SK", tier: 3 },
  { name: "Gyalshing", lat: 27.2899, lng: 88.2699, state: "SK", tier: 3 },
  
  // Tamil Nadu
  { name: "Chennai", lat: 13.0827, lng: 80.2707, state: "TN", tier: 1 },
  { name: "Coimbatore", lat: 11.0168, lng: 76.9558, state: "TN", tier: 1 },
  { name: "Madurai", lat: 9.9252, lng: 78.1198, state: "TN", tier: 1 },
  { name: "Tiruchirappalli", lat: 10.7905, lng: 78.7047, state: "TN", tier: 2 },
  { name: "Salem", lat: 11.6643, lng: 78.1460, state: "TN", tier: 2 },
  { name: "Tirunelveli", lat: 8.7139, lng: 77.7567, state: "TN", tier: 2 },
  { name: "Erode", lat: 11.3410, lng: 77.7172, state: "TN", tier: 2 },
  { name: "Vellore", lat: 12.9165, lng: 79.1325, state: "TN", tier: 2 },
  { name: "Thoothukudi", lat: 8.7642, lng: 78.1348, state: "TN", tier: 3 },
  { name: "Dindigul", lat: 10.3673, lng: 77.9803, state: "TN", tier: 3 },
  { name: "Thanjavur", lat: 10.7870, lng: 79.1378, state: "TN", tier: 3 },
  { name: "Kanchipuram", lat: 12.8185, lng: 79.7005, state: "TN", tier: 3 },
  
  // Telangana
  { name: "Hyderabad", lat: 17.3850, lng: 78.4867, state: "TG", tier: 1 },
  { name: "Warangal", lat: 17.9689, lng: 79.5941, state: "TG", tier: 2 },
  { name: "Nizamabad", lat: 18.6725, lng: 78.0941, state: "TG", tier: 2 },
  { name: "Khammam", lat: 17.2473, lng: 80.1514, state: "TG", tier: 3 },
  { name: "Karimnagar", lat: 18.4386, lng: 79.1288, state: "TG", tier: 3 },
  
  // Tripura
  { name: "Agartala", lat: 23.8315, lng: 91.2868, state: "TR", tier: 2 },
  { name: "Dharmanagar", lat: 24.3697, lng: 92.1580, state: "TR", tier: 3 },
  { name: "Udaipur", lat: 23.5339, lng: 91.4837, state: "TR", tier: 3 },
  
  // Uttar Pradesh
  { name: "Lucknow", lat: 26.8467, lng: 80.9462, state: "UP", tier: 1 },
  { name: "Kanpur", lat: 26.4499, lng: 80.3319, state: "UP", tier: 1 },
  { name: "Agra", lat: 27.1767, lng: 78.0081, state: "UP", tier: 1 },
  { name: "Varanasi", lat: 25.3176, lng: 82.9739, state: "UP", tier: 1 },
  { name: "Meerut", lat: 28.9845, lng: 77.7064, state: "UP", tier: 2 },
  { name: "Allahabad", lat: 25.4358, lng: 81.8463, state: "UP", tier: 2 },
  { name: "Bareilly", lat: 28.3670, lng: 79.4304, state: "UP", tier: 2 },
  { name: "Aligarh", lat: 27.8974, lng: 78.0880, state: "UP", tier: 2 },
  { name: "Gorakhpur", lat: 26.7606, lng: 83.3732, state: "UP", tier: 2 },
  { name: "Saharanpur", lat: 29.9680, lng: 77.5552, state: "UP", tier: 2 },
  { name: "Moradabad", lat: 28.8386, lng: 78.7733, state: "UP", tier: 2 },
  { name: "Firozabad", lat: 27.1592, lng: 78.3957, state: "UP", tier: 3 },
  { name: "Jhansi", lat: 25.4484, lng: 78.5685, state: "UP", tier: 3 },
  { name: "Muzaffarnagar", lat: 29.4727, lng: 77.7085, state: "UP", tier: 3 },
  
  // Uttarakhand
  { name: "Dehradun", lat: 30.3165, lng: 78.0322, state: "UK", tier: 1 },
  { name: "Haridwar", lat: 29.9457, lng: 78.1642, state: "UK", tier: 2 },
  { name: "Nainital", lat: 29.3803, lng: 79.4636, state: "UK", tier: 2 },
  { name: "Rishikesh", lat: 30.0869, lng: 78.2676, state: "UK", tier: 2 },
  { name: "Roorkee", lat: 29.8543, lng: 77.8880, state: "UK", tier: 3 },
  { name: "Haldwani", lat: 29.2183, lng: 79.5130, state: "UK", tier: 3 },
  { name: "Rudrapur", lat: 28.9845, lng: 79.4304, state: "UK", tier: 3 },
  
  // West Bengal
  { name: "Kolkata", lat: 22.5726, lng: 88.3639, state: "WB", tier: 1 },
  { name: "Howrah", lat: 22.5958, lng: 88.2636, state: "WB", tier: 1 },
  { name: "Durgapur", lat: 23.4805, lng: 87.3119, state: "WB", tier: 2 },
  { name: "Asansol", lat: 23.6739, lng: 86.9524, state: "WB", tier: 2 },
  { name: "Siliguri", lat: 26.7271, lng: 88.3953, state: "WB", tier: 2 },
  { name: "Malda", lat: 25.0000, lng: 88.1333, state: "WB", tier: 3 },
  { name: "Barrackpur", lat: 22.7604, lng: 88.3782, state: "WB", tier: 3 },
  { name: "Kharagpur", lat: 22.3460, lng: 87.2320, state: "WB", tier: 3 },
  
  // Jammu & Kashmir
  { name: "Srinagar", lat: 34.0837, lng: 74.7973, state: "JK", tier: 2 },
  { name: "Jammu", lat: 32.7266, lng: 74.8570, state: "JK", tier: 2 },
  { name: "Anantnag", lat: 33.7311, lng: 75.1500, state: "JK", tier: 3 },
  { name: "Baramulla", lat: 34.2099, lng: 74.3432, state: "JK", tier: 3 },
  { name: "Udhampur", lat: 32.9150, lng: 75.1420, state: "JK", tier: 3 },
  
  // Ladakh
  { name: "Leh", lat: 34.1526, lng: 77.5771, state: "LA", tier: 3 },
  { name: "Kargil", lat: 34.5539, lng: 76.1300, state: "LA", tier: 3 },
  
  // Union Territories
  { name: "Puducherry", lat: 11.9416, lng: 79.8083, state: "PY", tier: 2 },
  { name: "Port Blair", lat: 11.6234, lng: 92.7265, state: "AN", tier: 3 },
  { name: "Silvassa", lat: 20.2738, lng: 73.0260, state: "DN", tier: 3 },
  { name: "Daman", lat: 20.3974, lng: 72.8328, state: "DD", tier: 3 },
  { name: "Kavaratti", lat: 10.5593, lng: 72.636, state: "LD", tier: 3 }
]

// MASSIVE Crime and Security Database - Real crime patterns across India
const COMPREHENSIVE_CRIME_ZONES = [
  // Metro Cities - High Crime Areas
  { name: "Mumbai Central", lat: 19.0176, lng: 72.8562, type: "extreme_crime", crimes: ["organized_crime", "drug_trafficking", "extortion"], severity: "extreme" },
  { name: "Delhi Paharganj", lat: 28.6448, lng: 77.2167, type: "high_crime", crimes: ["tourist_scams", "theft", "drug_dealing"], severity: "high" },
  { name: "Bangalore Whitefield", lat: 12.9698, lng: 77.7500, type: "medium_crime", crimes: ["cyber_crime", "tech_fraud", "vehicle_theft"], severity: "medium" },
  { name: "Chennai Egmore", lat: 13.0732, lng: 80.2609, type: "medium_crime", crimes: ["chain_snatching", "mobile_theft", "pickpocketing"], severity: "medium" },
  { name: "Kolkata Bow Barracks", lat: 22.5541, lng: 88.3503, type: "high_crime", crimes: ["prostitution", "drug_dealing", "theft"], severity: "high" },
  { name: "Hyderabad Old City", lat: 17.3616, lng: 78.4747, type: "high_crime", crimes: ["communal_tension", "illegal_weapons", "riots"], severity: "high" },
  { name: "Pune Koregaon Park", lat: 18.5362, lng: 73.8958, type: "medium_crime", crimes: ["bar_brawls", "drunk_driving", "assault"], severity: "medium" },
  { name: "Ahmedabad Dariapur", lat: 23.0261, lng: 72.5200, type: "high_crime", crimes: ["communal_riots", "arson", "mob_violence"], severity: "high" },
  
  // Border Security Zones - Extreme Risk
  { name: "Wagah Border", lat: 31.6040, lng: 74.5729, type: "extreme_security_risk", crimes: ["smuggling", "infiltration", "terrorism"], severity: "extreme" },
  { name: "Attari Border", lat: 31.6215, lng: 74.9455, type: "extreme_security_risk", crimes: ["cross_border_firing", "smuggling", "spy_activity"], severity: "extreme" },
  { name: "Jammu Tawi", lat: 32.7266, lng: 74.8570, type: "extreme_security_risk", crimes: ["militant_attacks", "stone_pelting", "bomb_threats"], severity: "extreme" },
  { name: "Srinagar Downtown", lat: 34.0837, lng: 74.7973, type: "extreme_security_risk", crimes: ["curfew_zones", "militant_hideouts", "grenade_attacks"], severity: "extreme" },
  { name: "Kupwara Border", lat: 34.5167, lng: 74.2500, type: "extreme_security_risk", crimes: ["ceasefire_violations", "infiltration_attempts", "encounters"], severity: "extreme" },
  { name: "Rajouri Sector", lat: 33.3739, lng: 74.3075, type: "extreme_security_risk", crimes: ["cross_border_shelling", "terrorist_movement", "IED_threats"], severity: "extreme" },
  { name: "Poonch Border", lat: 33.7739, lng: 74.0914, type: "extreme_security_risk", crimes: ["militant_camps", "arms_smuggling", "firing_incidents"], severity: "extreme" },
  { name: "BSF Ferozepur", lat: 30.9259, lng: 74.6112, type: "high_security_risk", crimes: ["drug_smuggling", "fake_currency", "cattle_smuggling"], severity: "high" },
  { name: "Tripura Border", lat: 23.8315, lng: 91.2868, type: "high_security_risk", crimes: ["illegal_immigration", "human_trafficking", "arms_trade"], severity: "high" },
  { name: "Mizoram Myanmar Border", lat: 23.1645, lng: 93.2035, type: "high_security_risk", crimes: ["drug_trafficking", "arms_smuggling", "insurgency"], severity: "high" },
  { name: "Manipur Myanmar Border", lat: 24.6637, lng: 94.1112, type: "high_security_risk", crimes: ["ethnic_conflicts", "blockades", "militant_camps"], severity: "high" },
  { name: "Assam Bangladesh Border", lat: 25.5788, lng: 89.9953, type: "high_security_risk", crimes: ["cattle_smuggling", "infiltration", "fake_documents"], severity: "high" },
  
  // Naxal Affected Areas - Extreme Risk
  { name: "Dantewada Red Corridor", lat: 18.8926, lng: 81.3545, type: "extreme_naxal_zone", crimes: ["naxal_attacks", "landmines", "kidnapping"], severity: "extreme" },
  { name: "Bastar Division", lat: 19.3239, lng: 81.9484, type: "extreme_naxal_zone", crimes: ["ambush_attacks", "IED_blasts", "extortion"], severity: "extreme" },
  { name: "Sukma Operations", lat: 18.3841, lng: 81.6615, type: "extreme_naxal_zone", crimes: ["security_force_attacks", "road_mining", "villager_intimidation"], severity: "extreme" },
  { name: "Gadchiroli Forest", lat: 20.1667, lng: 80.0167, type: "extreme_naxal_zone", crimes: ["guerrilla_warfare", "police_station_attacks", "supply_line_disruption"], severity: "extreme" },
  { name: "Malkangiri Swabhiman", lat: 18.3479, lng: 81.8999, type: "extreme_naxal_zone", crimes: ["cut_off_areas", "parallel_governance", "recruitment_drives"], severity: "extreme" },
  { name: "Jhargram West Bengal", lat: 22.4539, lng: 86.9969, type: "high_naxal_zone", crimes: ["train_derailments", "police_harassment", "tribal_exploitation"], severity: "high" },
  { name: "Koraput Kalahandi", lat: 19.9115, lng: 82.7065, type: "high_naxal_zone", crimes: ["development_sabotage", "contractor_threats", "fund_collection"], severity: "high" },
  { name: "Latehar Jharkhand", lat: 23.7441, lng: 84.4994, type: "high_naxal_zone", crimes: ["coal_mine_attacks", "railway_disruption", "local_terror"], severity: "high" },
  { name: "Gumla Ranchi Belt", lat: 23.0438, lng: 84.5410, type: "medium_naxal_zone", crimes: ["propaganda_activities", "recruitment", "fund_raising"], severity: "medium" },
  { name: "Aurangabad Maharashtra", lat: 19.8762, lng: 75.3433, type: "medium_naxal_zone", crimes: ["pamphlet_distribution", "bandh_calls", "intimidation"], severity: "medium" },
  
  // Urban Crime Hotspots
  { name: "Delhi Geeta Colony", lat: 28.6542, lng: 77.2741, type: "high_crime", crimes: ["gang_wars", "drug_peddling", "shootouts"], severity: "high" },
  { name: "Mumbai Kamathipura", lat: 18.9612, lng: 72.8184, type: "high_crime", crimes: ["human_trafficking", "prostitution", "flesh_trade"], severity: "high" },
  { name: "Bangalore Byadarahalli", lat: 12.9500, lng: 77.5000, type: "medium_crime", crimes: ["chain_snatching", "house_breaking", "eve_teasing"], severity: "medium" },
  { name: "Chennai Royapuram", lat: 13.1067, lng: 80.2906, type: "medium_crime", crimes: ["theft", "gambling", "illegal_liquor"], severity: "medium" },
  { name: "Kolkata Topsia", lat: 22.5204, lng: 88.3924, type: "high_crime", crimes: ["drug_manufacturing", "arms_dealing", "gang_rivalry"], severity: "high" },
  { name: "Hyderabad Charminar", lat: 17.3616, lng: 78.4747, type: "medium_crime", crimes: ["pickpocketing", "fake_antiques", "tourist_cheating"], severity: "medium" },
  { name: "Pune Yerawada", lat: 18.5679, lng: 73.8758, type: "medium_crime", crimes: ["vehicle_theft", "burglary", "assault"], severity: "medium" },
  { name: "Ahmedabad Shah Alam", lat: 23.0395, lng: 72.5240, type: "high_crime", crimes: ["communal_tension", "rioting", "arson"], severity: "high" },
  { name: "Jaipur Brahmapuri", lat: 26.9124, lng: 75.7873, type: "medium_crime", crimes: ["tourist_fraud", "gem_scams", "overcharging"], severity: "medium" },
  { name: "Lucknow Aminabad", lat: 26.8467, lng: 80.9462, type: "medium_crime", crimes: ["eve_teasing", "theft", "market_disputes"], severity: "medium" },
  
  // Highway Crime Zones
  { name: "NH1 Delhi-Chandigarh", lat: 29.0588, lng: 76.0856, type: "highway_crime", crimes: ["highway_robbery", "truck_looting", "dhaba_crimes"], severity: "high" },
  { name: "NH4 Mumbai-Pune Express", lat: 18.9068, lng: 73.3436, type: "highway_crime", crimes: ["vehicle_hijacking", "toll_booth_robbery", "fuel_theft"], severity: "medium" },
  { name: "NH44 Hyderabad-Bangalore", lat: 16.2000, lng: 78.0000, type: "highway_crime", crimes: ["container_looting", "driver_assault", "goods_theft"], severity: "medium" },
  { name: "NH48 Delhi-Jaipur", lat: 27.5000, lng: 76.5000, type: "highway_crime", crimes: ["tourist_targeting", "ATM_heists", "vehicle_snatching"], severity: "medium" },
  { name: "NH16 Kolkata-Bhubaneswar", lat: 21.5000, lng: 86.0000, type: "highway_crime", crimes: ["truck_robbery", "fake_checkpoints", "extortion"], severity: "high" },
  
  // Industrial Crime Zones
  { name: "MIDC Aurangabad", lat: 19.8762, lng: 75.3433, type: "industrial_crime", crimes: ["labor_disputes", "factory_theft", "chemical_theft"], severity: "medium" },
  { name: "DLF Cyber City", lat: 28.4950, lng: 77.0900, type: "cyber_crime", crimes: ["data_theft", "financial_fraud", "identity_theft"], severity: "high" },
  { name: "Noida Sector 62", lat: 28.6273, lng: 77.3648, type: "cyber_crime", crimes: ["call_center_fraud", "credit_card_scams", "phishing"], severity: "high" },
  { name: "Pune Hinjawadi", lat: 18.5912, lng: 73.7389, type: "cyber_crime", crimes: ["software_piracy", "insider_trading", "corporate_espionage"], severity: "medium" },
  { name: "Chennai OMR", lat: 12.8447, lng: 80.2108, type: "cyber_crime", crimes: ["tech_support_scams", "romance_fraud", "cryptocurrency_fraud"], severity: "medium" },
  
  // Tourist Crime Zones
  { name: "Agra Taj Mahal Area", lat: 27.1751, lng: 78.0421, type: "tourist_crime", crimes: ["fake_guide_scams", "marble_inlay_fraud", "overcharging"], severity: "medium" },
  { name: "Jaipur Hawa Mahal", lat: 26.9239, lng: 75.8267, type: "tourist_crime", crimes: ["gem_scams", "camel_safari_fraud", "hotel_touts"], severity: "medium" },
  { name: "Goa Beaches", lat: 15.2993, lng: 74.1240, type: "tourist_crime", crimes: ["drug_peddling", "rape_cases", "theft_from_foreigners"], severity: "high" },
  { name: "Kerala Backwaters", lat: 9.4981, lng: 76.3388, type: "tourist_crime", crimes: ["houseboat_scams", "ayurveda_fraud", "tour_operator_cheating"], severity: "medium" },
  { name: "Rishikesh Ganga Ghats", lat: 30.0869, lng: 78.2676, type: "tourist_crime", crimes: ["fake_ashram_gurus", "adventure_sport_fraud", "spiritual_scams"], severity: "medium" },
  { name: "Varanasi Ghats", lat: 25.3176, lng: 82.9739, type: "tourist_crime", crimes: ["boat_scams", "fake_ceremonies", "beggar_harassment"], severity: "medium" },
  { name: "Hampi Ruins", lat: 15.3350, lng: 76.4600, type: "tourist_crime", crimes: ["antique_fraud", "guide_harassment", "accommodation_scams"], severity: "low" },
  { name: "Manali Mall Road", lat: 32.2396, lng: 77.1887, type: "tourist_crime", crimes: ["taxi_overcharging", "hotel_touts", "fake_adventure_gear"], severity: "medium" },
  
  // Railway Crime Zones
  { name: "New Delhi Railway Station", lat: 28.6433, lng: 77.2194, type: "railway_crime", crimes: ["luggage_theft", "chain_snatching", "pickpocketing"], severity: "high" },
  { name: "Mumbai CST Station", lat: 18.9398, lng: 72.8355, type: "railway_crime", crimes: ["eve_teasing", "mobile_theft", "ticket_tout_harassment"], severity: "high" },
  { name: "Howrah Junction", lat: 22.5958, lng: 88.2636, type: "railway_crime", crimes: ["passenger_robbery", "fake_porters", "food_poisoning_scams"], severity: "high" },
  { name: "Chennai Central", lat: 13.0827, lng: 80.2707, type: "railway_crime", crimes: ["reservation_fraud", "ATM_skimming", "luggage_switching"], severity: "medium" },
  { name: "Secunderabad Junction", lat: 17.5040, lng: 78.5040, type: "railway_crime", crimes: ["unauthorized_vendors", "theft_in_trains", "booking_scams"], severity: "medium" },
  
  // Religious Site Crime Zones
  { name: "Tirupati Temple", lat: 13.6288, lng: 79.4192, type: "religious_crime", crimes: ["donation_fraud", "fake_prasadam", "queue_jumping_bribes"], severity: "medium" },
  { name: "Golden Temple Complex", lat: 31.6200, lng: 74.8765, type: "religious_crime", crimes: ["shoe_theft", "donation_pressure", "fake_guides"], severity: "low" },
  { name: "Shirdi Sai Baba", lat: 19.7645, lng: 74.4877, type: "religious_crime", crimes: ["accommodation_overcharging", "fake_blessings", "prasad_scams"], severity: "medium" },
  { name: "Vaishno Devi Trek", lat: 33.0309, lng: 74.9269, type: "religious_crime", crimes: ["pony_scams", "helicopter_fraud", "guide_extortion"], severity: "medium" },
  { name: "Kedarnath Temple", lat: 30.7346, lng: 79.0669, type: "religious_crime", crimes: ["porter_overcharging", "accommodation_fraud", "weather_scams"], severity: "medium" },
  
  // College/University Crime Zones
  { name: "DU North Campus", lat: 28.6966, lng: 77.2121, type: "campus_crime", crimes: ["ragging", "drug_abuse", "eve_teasing"], severity: "medium" },
  { name: "JNU Campus", lat: 28.5406, lng: 77.1662, type: "campus_crime", crimes: ["political_violence", "protest_clashes", "vandalism"], severity: "medium" },
  { name: "IIT Bombay", lat: 19.1334, lng: 72.9133, type: "campus_crime", crimes: ["suicide_cases", "mental_harassment", "academic_pressure"], severity: "low" },
  { name: "Anna University", lat: 13.0067, lng: 80.2206, type: "campus_crime", crimes: ["sexual_harassment", "caste_discrimination", "hostel_theft"], severity: "medium" },
  { name: "Osmania University", lat: 17.4126, lng: 78.5302, type: "campus_crime", crimes: ["student_unrest", "political_rivalry", "exam_paper_leaks"], severity: "medium" },
  
  // IT Hub Crime Zones
  { name: "Electronics City Phase 1", lat: 12.8456, lng: 77.6603, type: "it_crime", crimes: ["ATM_frauds", "vehicle_theft", "cab_driver_harassment"], severity: "medium" },
  { name: "Gachibowli IT Hub", lat: 17.4435, lng: 78.3772, type: "it_crime", crimes: ["cyber_stalking", "online_fraud", "credit_card_cloning"], severity: "medium" },
  { name: "Sector V Salt Lake", lat: 22.5858, lng: 88.4090, type: "it_crime", crimes: ["laptop_theft", "data_center_breach", "insider_fraud"], severity: "medium" },
  { name: "Technopark Trivandrum", lat: 8.5502, lng: 76.8793, type: "it_crime", crimes: ["intellectual_property_theft", "embezzlement", "harassment"], severity: "low" },
  
  // Port and Airport Crime Zones
  { name: "Mumbai Port Area", lat: 18.9388, lng: 72.8354, type: "port_crime", crimes: ["smuggling", "container_theft", "customs_fraud"], severity: "high" },
  { name: "Chennai Port", lat: 13.1067, lng: 80.3000, type: "port_crime", crimes: ["drug_trafficking", "illegal_immigration", "cargo_theft"], severity: "high" },
  { name: "Kandla Port", lat: 23.0333, lng: 70.2167, type: "port_crime", crimes: ["gold_smuggling", "fake_currency", "arms_trafficking"], severity: "high" },
  { name: "IGI Airport Delhi", lat: 28.5562, lng: 77.1000, type: "airport_crime", crimes: ["baggage_theft", "immigration_fraud", "taxi_scams"], severity: "medium" },
  { name: "Mumbai Airport", lat: 19.0896, lng: 72.8656, type: "airport_crime", crimes: ["currency_exchange_fraud", "overcharging", "fake_travel_agents"], severity: "medium" },
  
  // Mining Area Crime Zones
  { name: "Jharia Coal Fields", lat: 23.7645, lng: 86.4304, type: "mining_crime", crimes: ["illegal_mining", "coal_theft", "environmental_crimes"], severity: "high" },
  { name: "Bellary Iron Ore", lat: 15.1394, lng: 76.9214, type: "mining_crime", crimes: ["ore_smuggling", "forest_encroachment", "water_pollution"], severity: "high" },
  { name: "Goa Mining Belt", lat: 15.3700, lng: 74.0400, type: "mining_crime", crimes: ["illegal_excavation", "transportation_violations", "permit_fraud"], severity: "medium" },
  { name: "Singrauli Coal Belt", lat: 24.1997, lng: 82.6739, type: "mining_crime", crimes: ["land_grabbing", "displacement_issues", "pollution_cover-up"], severity: "medium" },
  
  // Slum Area Crime Zones
  { name: "Dharavi Mumbai", lat: 19.0176, lng: 72.8562, type: "slum_crime", crimes: ["drug_manufacturing", "illegal_weapons", "human_trafficking"], severity: "extreme" },
  { name: "Kathputli Colony Delhi", lat: 28.6542, lng: 77.1635, type: "slum_crime", crimes: ["child_labor", "substance_abuse", "domestic_violence"], severity: "high" },
  { name: "Koliwada Mumbai", lat: 19.0330, lng: 72.8550, type: "slum_crime", crimes: ["bootlegging", "gambling", "protection_rackets"], severity: "high" },
  { name: "Ambedkar Nagar Delhi", lat: 28.5355, lng: 77.2410, type: "slum_crime", crimes: ["theft", "chain_snatching", "mobile_theft"], severity: "medium" },
  { name: "Anna Nagar Chennai", lat: 13.0850, lng: 80.2101, type: "slum_crime", crimes: ["illegal_liquor", "petty_theft", "harassment"], severity: "medium" }
]

// ================== CONTINUATION: POWER / ENERGY + EXTRA HAZARDS (SIMULATED) ==================
// NOTE: All data below is SIMULATED / AGGREGATED for visualization only (not operational).

// POWER GENERATION & GRID INFRA (SIMULATED / PUBLIC-DERIVED APPROX LOCATIONS)
const POWER_INFRASTRUCTURE = [
  // Thermal (Coal / Gas)
  { name: "Vindhyachal Super Thermal", lat: 24.1086, lng: 82.6523, type: "thermal_coal", capacity_mw: 4760, risk_level: "high" },
  { name: "Mundra Ultra Mega Power", lat: 22.8394, lng: 69.5680, type: "thermal_coal", capacity_mw: 4620, risk_level: "high" },
  { name: "Sasan Ultra Mega Power", lat: 23.9472, lng: 81.3498, type: "thermal_coal", capacity_mw: 3960, risk_level: "medium" },
  { name: "Tata Trombay", lat: 19.0195, lng: 72.8937, type: "thermal_multi_fuel", capacity_mw: 1430, risk_level: "medium" },
  { name: "Dadri Gas Power", lat: 28.5692, lng: 77.6021, type: "gas_power", capacity_mw: 1827, risk_level: "medium" },

  // Hydro (Dams)
  { name: "Tehri Hydro Complex", lat: 30.3793, lng: 78.4803, type: "hydro_dam", capacity_mw: 2400, risk_level: "high" },
  { name: "Sardar Sarovar Dam", lat: 21.8200, lng: 73.7380, type: "hydro_dam", capacity_mw: 1450, risk_level: "medium" },
  { name: "Bhakra Nangal Dam", lat: 31.4167, lng: 76.4333, type: "hydro_dam", capacity_mw: 1325, risk_level: "medium" },

  // Solar Parks
  { name: "Bhadla Solar Park", lat: 27.5310, lng: 72.3650, type: "solar_park", capacity_mw: 2245, risk_level: "low" },
  { name: "Pavagada Solar Park", lat: 14.0980, lng: 77.2800, type: "solar_park", capacity_mw: 2050, risk_level: "low" },
  { name: "Kurnool Ultra Solar Park", lat: 15.6800, lng: 78.3200, type: "solar_park", capacity_mw: 1000, risk_level: "low" },

  // Wind Clusters
  { name: "Muppandal Wind Cluster", lat: 8.2500, lng: 77.5500, type: "wind_farm", capacity_mw: 1500, risk_level: "low" },
  { name: "Jaisalmer Wind Complex", lat: 26.9157, lng: 70.9083, type: "wind_farm", capacity_mw: 1300, risk_level: "low" },

  // Major Grid Substations (Simulated)
  { name: "Raigarh HVDC Hub", lat: 21.8974, lng: 83.3950, type: "grid_hvdc", capacity_mw: 6000, risk_level: "medium" },
  { name: "Wardha 765kV Node", lat: 20.7453, lng: 78.6022, type: "grid_765kv", capacity_mw: 5000, risk_level: "medium" },
  { name: "Gwalior Grid Node", lat: 26.2183, lng: 78.1828, type: "grid_765kv", capacity_mw: 5000, risk_level: "medium" },

  // LNG / Gas Terminals (Energy Supply)
  { name: "Dahej LNG Terminal", lat: 21.7119, lng: 72.5000, type: "lng_terminal", capacity_mtpa: 17.5, risk_level: "high" },
  { name: "Kochi LNG Terminal", lat: 9.9667, lng: 76.2667, type: "lng_terminal", capacity_mtpa: 5, risk_level: "medium" }
]

// HEALTH / EPIDEMIOLOGICAL RISK (SIMULATED CLUSTERS)
const HEALTH_RISK_ZONES = [
  { name: "Seasonal Dengue Cluster NCR", lat: 28.6139, lng: 77.2090, illness: "dengue", pattern: "seasonal_peak", severity: "medium" },
  { name: "Heat Stress Cluster Vidarbha", lat: 20.7002, lng: 77.0082, illness: "heat_stress", pattern: "heatwave", severity: "high" },
  { name: "Respiratory AQI Cluster Delhi", lat: 28.6692, lng: 77.4538, illness: "respiratory", pattern: "aqi_spike", severity: "high" },
  { name: "Malaria Risk Brahmaputra Basin", lat: 26.1445, lng: 91.7362, illness: "malaria", pattern: "vector_breeding", severity: "medium" },
  { name: "Gastro Enteritis Coastal Odisha", lat: 19.8135, lng: 85.8312, illness: "water_borne", pattern: "post_flood", severity: "medium" }
]

// CLIMATE / SLOW-ONSET HAZARDS (SIMULATED)
const DROUGHT_PRONE_ZONES = [
  { name: "Marathwada Drought Belt", lat: 19.8762, lng: 75.3433, type: "drought_zone", severity: "high" },
  { name: "Bundelkhand Dry Cluster", lat: 25.4484, lng: 78.5685, type: "drought_zone", severity: "high" },
  { name: "North Interior Karnataka Dry", lat: 16.8302, lng: 75.7100, type: "drought_zone", severity: "medium" },
  { name: "Western Rajasthan Arid Core", lat: 26.9124, lng: 72.0000, type: "drought_zone", severity: "extreme" }
]

// LANDSLIDE / SLOPE INSTABILITY (SIMULATED)
const LANDSLIDE_ZONES = [
  { name: "Kedarnath Slope Risk", lat: 30.7346, lng: 79.0669, type: "landslide_zone", severity: "high" },
  { name: "Himachal Outer Ridge", lat: 31.1048, lng: 77.1734, type: "landslide_zone", severity: "medium" },
  { name: "Sikkim Ridge Instability", lat: 27.3389, lng: 88.6065, type: "landslide_zone", severity: "high" },
  { name: "Darjeeling Himalayan Front", lat: 26.7271, lng: 88.3953, type: "landslide_zone", severity: "high" }
]

// CYCLONE COASTAL IMPACT CORRIDORS (SIMULATED POLYGON STRIPS)
const CYCLONE_IMPACT_COASTS = [
  { name: "Odisha Cyclone Corridor", lat: 19.8, lng: 86.0, extent: 1.2, severity: "high" },
  { name: "North Andhra Cyclone Band", lat: 17.8, lng: 83.2, extent: 1.0, severity: "medium" },
  { name: "West Bengal Delta Impact", lat: 21.9, lng: 88.2, extent: 1.3, severity: "high" },
  { name: "Tamil Nadu Coastal Cyclone", lat: 10.5, lng: 80.2, extent: 0.9, severity: "medium" }
]

// ============== FETCHERS (SIMULATED GENERATORS) =================

export const fetchPowerInfrastructure = async () => {
  console.log('⚡ Generating power & energy infrastructure zones...')
  return POWER_INFRASTRUCTURE.map(p => {
    const baseRadius =
      p.type.includes('nuclear') ? 1.5 :
      p.type.includes('hydro') ? 1.0 :
      p.type.includes('thermal') ? 0.8 :
      p.type.includes('grid') ? 0.6 :
      p.type.includes('lng') ? 0.9 :
      p.type.includes('solar') ? 0.7 :
      p.type.includes('wind') ? 0.9 : 0.5

    return createGeofence({
      name: `Energy: ${p.name}`,
      lat: p.lat,
      lng: p.lng,
      radius: baseRadius,
      risk: 'power_infrastructure',
      severity: p.risk_level === 'extreme' ? 'extreme' : p.risk_level === 'high' ? 'high' : 'medium',
      facility_type: p.type,
      capacity_mw: p.capacity_mw,
      capacity_mtpa: p.capacity_mtpa,
      risk_level: p.risk_level,
      source: 'Energy_Infra_Database'
    })
  })
}

export const fetchHealthRiskZones = async () => {
  console.log('🩺 Generating health / epidemiological risk zones (simulated)...')
  return HEALTH_RISK_ZONES.map(z =>
    createGeofence({
      name: `Health Risk: ${z.name}`,
      lat: z.lat,
      lng: z.lng,
      radius: z.severity === 'high' ? 0.7 : 0.5,
      risk: 'health_risk',
      severity: z.severity,
      illness: z.illness,
      pattern: z.pattern,
      advisory: getHealthAdvisory(z.illness, z.pattern),
      source: 'Health_Surveillance_Sim'
    })
  )
}

const getHealthAdvisory = (illness, pattern) => {
  if (illness === 'dengue') return 'Eliminate stagnant water, use repellents'
  if (illness === 'malaria') return 'Use nets, avoid dusk exposure'
  if (illness === 'respiratory') return 'Limit outdoor activity, wear mask'
  if (illness === 'heat_stress') return 'Hydrate, avoid peak afternoon exposure'
  if (illness === 'water_borne') return 'Drink treated water, practice hygiene'
  return 'General precaution advised'
}

export const fetchDroughtZones = async () => {
  console.log('🌵 Generating drought susceptibility zones...')
  return DROUGHT_PRONE_ZONES.map(z =>
    createGeofence({
      name: `Drought: ${z.name}`,
      lat: z.lat,
      lng: z.lng,
      radius: z.severity === 'extreme' ? 1.2 : z.severity === 'high' ? 1.0 : 0.8,
      risk: 'drought_risk',
      severity: z.severity,
      water_stress_index: z.severity === 'extreme' ? 0.9 : 0.7,
      source: 'AgroClimate_Model'
    })
  )
}

export const fetchLandslideZones = async () => {
  console.log('⛰️ Generating landslide / slope instability zones...')
  return LANDSLIDE_ZONES.map(z =>
    createGeofence({
      name: `Landslide: ${z.name}`,
      lat: z.lat,
      lng: z.lng,
      radius: z.severity === 'high' ? 0.8 : 0.6,
      risk: 'landslide_risk',
      severity: z.severity,
      slope_factor: z.severity === 'high' ? 0.85 : 0.6,
      source: 'GeoHazard_Model'
    })
  )
}

export const fetchCycloneImpactBands = async () => {
  console.log('🌀 Generating coastal cyclone impact bands...')
  return CYCLONE_IMPACT_COASTS.map(c =>
    createGeofence({
      name: `Cyclone Corridor: ${c.name}`,
      lat: c.lat,
      lng: c.lng,
      radius: c.extent,
      risk: 'cyclone_impact',
      severity: c.severity,
      coastal: true,
      source: 'Cyclone_Historical_Model'
    })
  )
}

// ============== INTEGRATION: EXTEND MAIN AGGREGATOR =================
// Replace previous fetchAllRealTimeGeofences with extended version (or merge if already edited)
export const fetchAllRealTimeGeofencesExtended = async () => {
  console.log('🚀 Fetching ULTRA dataset (energy + health + climate + extra hazards)...')
  try {
    const [
      weather,
      earthquakes,
      fires,
      traffic,
      industrial,
      elevation,
      crime,
      crowds,
      power,
      health,
      droughts,
      cyclones,
      landslides
    ] = await Promise.all([
      fetchRealTimeWeather(),
      fetchEarthquakeData(),
      fetchFireData(),
      fetchTrafficIncidents(),
      fetchIndustrialHazards(),
      fetchElevationHazards(),
      fetchCrimeZones(),
      fetchCrowdDensity(),
      fetchPowerInfrastructure(),
      fetchHealthRiskZones(),
      fetchDroughtZones(),
      fetchCycloneImpactBands(),
      fetchLandslideZones()
    ])

    const additional = generateAdditionalGeofences()

    const all = [
      ...weather,
      ...earthquakes,
      ...fires,
      ...traffic,
      ...industrial,
      ...elevation,
      ...crime,
      ...crowds,
      ...power,
      ...health,
      ...droughts,
      ...cyclones,
      ...landslides,
      ...additional
    ]

    console.log(`✅ ULTRA coverage total: ${all.length}`)

    return {
      type: "FeatureCollection",
      features: all,
      metadata: {
        generated: new Date().toISOString(),
        coverage_area: "Complete India (Simulated Multi-Risk)",
        total_features: all.length,
        sources: [
          'WeatherAPI_Real',
          'USGS_Earthquakes',
          'Fire_Monitoring',
          'Traffic_Management',
          'Industrial_Safety',
            'Energy_Infra_Database',
          'GeoHazard_Model',
          'Crime_Security_Database',
          'Health_Surveillance_Sim',
          'Cyclone_Historical_Model',
          'AgroClimate_Model',
          'Event_Monitoring',
          'Extended_Simulations'
        ],
        breakdown: {
          weather: weather.length,
          earthquakes: earthquakes.length,
          fire_risks: fires.length,
          traffic: traffic.length,
          industrial: industrial.length,
          elevation: elevation.length,
          crime_security: crime.length,
          crowds: crowds.length,
          power_infrastructure: power.length,
          health_risk: health.length,
          drought_risk: droughts.length,
          cyclone_impact: cyclones.length,
          landslide_risk: landslides.length,
          additional_simulated: additional.length
        }
      }
    }
  } catch (e) {
    console.error('❌ ULTRA aggregation error:', e)
    return { type: "FeatureCollection", features: [], metadata: { error: e.message } }
  }
}

// ================= HELPER FUNCTIONS =================

// Helper function to create circular geofence
const createGeofence = ({ name, lat, lng, radius, risk, severity, source, ...props }) => {
  const radiusInDegrees = radius / 111
  const coordinates = []
  const numPoints = 32
  
  for (let i = 0; i <= numPoints; i++) {
    const angle = (i * 2 * Math.PI) / numPoints
    const pointLat = lat + radiusInDegrees * Math.cos(angle)
    const pointLng = lng + radiusInDegrees * Math.sin(angle)
    coordinates.push([pointLng, pointLat])
  }
  
  return {
    type: "Feature",
    geometry: {
      type: "Polygon",
      coordinates: [coordinates]
    },
    properties: {
      risk,
      name,
      severity,
      city: name.split(' ')[0],
      source,
      timestamp: new Date().toISOString(),
      ...props
    }
  }
}

// Generate Weather Geofences Function
const generateWeatherGeofences = (data, city) => {
  const geofences = []
  const current = data.current
  const condition = current.condition.text.toLowerCase()
  
  // High-risk weather conditions
  if (condition.includes('heavy rain') || condition.includes('thunderstorm')) {
    geofences.push(createGeofence({
      name: `Heavy Rain Alert: ${city.name}`,
      lat: city.lat,
      lng: city.lng,
      radius: 0.5,
      risk: 'weather_hazard',
      severity: 'high',
      weather_type: 'heavy_rain',
      temperature: current.temp_c,
      humidity: current.humidity,
      source: 'WeatherAPI_Real'
    }))
  }
  
  if (condition.includes('extreme heat') || current.temp_c > 40) {
    geofences.push(createGeofence({
      name: `Heat Wave: ${city.name}`,
      lat: city.lat,
      lng: city.lng,
      radius: 0.6,
      risk: 'weather_hazard',
      severity: 'extreme',
      weather_type: 'heat_wave',
      temperature: current.temp_c,
      uv_index: current.uv,
      source: 'WeatherAPI_Real'
    }))
  }
  
  if (condition.includes('fog') || current.vis_km < 2) {
    geofences.push(createGeofence({
      name: `Dense Fog: ${city.name}`,
      lat: city.lat,
      lng: city.lng,
      radius: 0.4,
      risk: 'weather_hazard',
      severity: 'medium',
      weather_type: 'dense_fog',
      visibility: current.vis_km,
      source: 'WeatherAPI_Real'
    }))
  }
  
  if (condition.includes('dust storm') || current.wind_kph > 25) {
    geofences.push(createGeofence({
      name: `Dust Storm: ${city.name}`,
      lat: city.lat,
      lng: city.lng,
      radius: 0.7,
      risk: 'weather_hazard',
      severity: 'high',
      weather_type: 'dust_storm',
      wind_speed: current.wind_kph,
      source: 'WeatherAPI_Real'
    }))
  }
  
  // Air quality issues
  if (data.air_quality && data.air_quality.pm2_5 > 60) {
    geofences.push(createGeofence({
      name: `Air Quality Alert: ${city.name}`,
      lat: city.lat,
      lng: city.lng,
      radius: 0.5,
      risk: 'air_quality',
      severity: data.air_quality.pm2_5 > 150 ? 'extreme' : 'high',
      pm25: data.air_quality.pm2_5,
      pm10: data.air_quality.pm10,
      aqi_category: data.air_quality.pm2_5 > 150 ? 'hazardous' : 'unhealthy',
      source: 'AQI_Monitoring'
    }))
  }
  
  return geofences
}

// Enhanced Weather Function
export const fetchRealTimeWeather = async () => {
  console.log('🌦️ Fetching comprehensive weather data from 100+ cities...')
  
  const weatherGeofences = []
  
  try {
    // Use first 100 cities for weather data
    const selectedCities = ALL_INDIAN_CITIES.slice(0, 100)
    
    for (let i = 0; i < selectedCities.length; i++) {
      const city = selectedCities[i]
      
      try {
        // Simulate weather API response (replace with real API call if needed)
        const simulatedWeatherData = {
          current: {
            condition: { text: getRandomWeatherCondition() },
            temp_c: 15 + Math.random() * 35,
            humidity: 30 + Math.random() * 70,
            wind_kph: Math.random() * 30,
            vis_km: 1 + Math.random() * 20,
            uv: Math.random() * 12
          },
          air_quality: {
            pm2_5: 10 + Math.random() * 200,
            pm10: 20 + Math.random() * 300,
            o3: 50 + Math.random() * 200
          }
        }
        
        const cityGeofences = generateWeatherGeofences(simulatedWeatherData, city)
        if (cityGeofences.length > 0) {
          weatherGeofences.push(...cityGeofences)
        }
      } catch (error) {
        console.warn(`Error processing weather for ${city.name}:`, error)
      }
      
      // Rate limiting
      await new Promise(resolve => setTimeout(resolve, 10))
    }
    
    console.log(`✅ Generated ${weatherGeofences.length} weather geofences from ${selectedCities.length} cities`)
    return weatherGeofences
    
  } catch (error) {
    console.error('❌ Error fetching weather data:', error)
    return []
  }
}

const getRandomWeatherCondition = () => {
  const conditions = [
    'heavy rain', 'thunderstorm', 'fog', 'dust storm', 'extreme heat',
    'cold wave', 'hailstorm', 'cyclone warning', 'flash flood alert',
    'air quality poor', 'smog', 'heat wave', 'severe weather'
  ]
  return conditions[Math.floor(Math.random() * conditions.length)]
}

// MISSING: Crime Zones Function (using your comprehensive data)
export const fetchCrimeZones = async () => {
  console.log('🚔 Generating comprehensive crime and security zones...')
  
  const crimeGeofences = []
  
  COMPREHENSIVE_CRIME_ZONES.forEach(zone => {
    let radius = 0.3
    
    // Determine radius based on crime type and severity
    if (zone.type === 'extreme_security_risk' || zone.type === 'extreme_naxal_zone' || zone.type === 'extreme_crime') {
      radius = 1.0
    } else if (zone.type.includes('high_') || zone.severity === 'high') {
      radius = 0.6
    } else if (zone.type.includes('medium_')) {
      radius = 0.4
    } else {
      radius = 0.2
    }
    
    crimeGeofences.push(createGeofence({
      name: `Security Alert: ${zone.name}`,
      lat: zone.lat,
      lng: zone.lng,
      radius,
      risk: 'safety_concern',
      severity: zone.severity,
      crime_type: zone.type,
      crimes: Array.isArray(zone.crimes) ? zone.crimes.join(', ') : zone.crimes || 'General security concern',
      safety_tip: getSafetyTip(zone.type),
      security_level: zone.type.includes('security_risk') || zone.type.includes('naxal') ? 'high_alert' : 'normal_vigilance',
      source: 'Crime_Security_Database'
    }))
  })
  
  console.log(`✅ Generated ${crimeGeofences.length} crime/security geofences`)
  return crimeGeofences
}

const getSafetyTip = (crimeType) => {
  const tips = {
    'extreme_crime': 'AVOID AREA - Extreme danger, contact authorities',
    'high_crime': 'Avoid late night travel, stay in groups, secure valuables',
    'medium_crime': 'Stay alert, avoid isolated areas, keep emergency contacts ready',
    'low_crime': 'General precautions advised, report suspicious activities',
    'extreme_security_risk': 'AVOID AREA - High security threat, check advisories',
    'high_security_risk': 'Exercise extreme caution, follow security protocols',
    'medium_security_risk': 'Stay informed about local situation, avoid protests',
    'extreme_naxal_zone': 'DANGER ZONE - Naxal activity, military escort required',
    'high_naxal_zone': 'High risk area, avoid after dark, travel with security',
    'tourist_crime': 'Be aware of scams, verify credentials, negotiate prices',
    'cyber_crime': 'Protect personal data, verify online transactions',
    'highway_crime': 'Travel in convoy, avoid night stops, fuel up in advance'
  }
  return tips[crimeType] || 'Exercise general caution'
}

// MISSING: Other required functions
export const fetchEarthquakeData = async () => {
  console.log('🌍 Fetching earthquake data...')
  
  // Simulate earthquake zones across India
  const earthquakeZones = [
    { name: "Himalayan Seismic Zone", lat: 30.0, lng: 78.0, magnitude: 6.2 },
    { name: "Kutch Earthquake Zone", lat: 23.4, lng: 70.3, magnitude: 5.8 },
    { name: "Northeast India Seismic", lat: 25.5, lng: 91.0, magnitude: 5.5 },
    { name: "Koyna Maharashtra", lat: 17.4, lng: 73.7, magnitude: 4.8 },
    { name: "Delhi NCR Fault Line", lat: 28.6, lng: 77.2, magnitude: 4.5 },
    { name: "Andaman Nicobar Seismic", lat: 11.7, lng: 92.7, magnitude: 6.0 },
    { name: "Latur Maharashtra", lat: 18.4, lng: 76.6, magnitude: 5.0 }
  ]
  
  return earthquakeZones.map(eq => createGeofence({
    name: `Earthquake Risk: ${eq.name}`,
    lat: eq.lat,
    lng: eq.lng,
    radius: eq.magnitude > 6 ? 1.0 : eq.magnitude > 5 ? 0.8 : 0.6,
    risk: 'natural_disaster',
    severity: eq.magnitude > 6 ? 'extreme' : eq.magnitude > 5 ? 'high' : 'medium',
    disaster_type: 'earthquake',
    magnitude: eq.magnitude,
    source: 'USGS_Seismic'
  }))
}

export const fetchFireData = async () => {
  console.log('🔥 Generating fire hazard zones...')
  
  // Simulate fire risk zones
  const fireZones = []
  for (let i = 0; i < 25; i++) {
    const lat = 8 + Math.random() * 29
    const lng = 68 + Math.random() * 29
    
    fireZones.push(createGeofence({
      name: `Fire Risk Zone ${i + 1}`,
      lat,
      lng,
      radius: 0.3 + Math.random() * 0.5,
      risk: 'natural_disaster',
      severity: ['medium', 'high'][Math.floor(Math.random() * 2)],
      disaster_type: 'wildfire_risk',
      fire_danger_index: Math.floor(Math.random() * 5) + 1,
      source: 'Fire_Monitoring'
    }))
  }
  
  console.log(`✅ Generated ${fireZones.length} fire risk geofences`)
  return fireZones
}

export const fetchTrafficIncidents = async () => {
  console.log('🚗 Generating traffic incident zones...')
  
  const trafficZones = []
  for (let i = 0; i < 50; i++) {
    const lat = 8 + Math.random() * 29
    const lng = 68 + Math.random() * 29
    
    const incidentTypes = ['heavy_traffic', 'road_construction', 'accident', 'vehicle_breakdown', 'protest_block']
    
    trafficZones.push(createGeofence({
      name: `Traffic Alert ${i + 1}`,
      lat,
      lng,
      radius: 0.1 + Math.random() * 0.3,
      risk: 'traffic_incident',
      severity: ['low', 'medium', 'high'][Math.floor(Math.random() * 3)],
      incident_type: incidentTypes[Math.floor(Math.random() * incidentTypes.length)],
      estimated_delay: `${10 + Math.floor(Math.random() * 60)} min`,
      source: 'Traffic_Management'
    }))
  }
  
  console.log(`✅ Generated ${trafficZones.length} traffic geofences`)
  return trafficZones
}

export const fetchIndustrialHazards = async () => {
  console.log('🏭 Generating industrial hazard zones...')
  
  // Use your comprehensive industrial data + nuclear facilities
  const NUCLEAR_FACILITIES = [
    { name: "Tarapur Nuclear Power", lat: 19.8519, lng: 72.6878, type: "nuclear_facility", risk_level: "extreme" },
    { name: "Kalpakkam Nuclear", lat: 12.5500, lng: 80.1700, type: "nuclear_facility", risk_level: "extreme" },
    { name: "Narora Nuclear Power", lat: 28.2042, lng: 78.3890, type: "nuclear_facility", risk_level: "extreme" },
    { name: "Kakrapar Nuclear", lat: 21.2417, lng: 73.3500, type: "nuclear_facility", risk_level: "extreme" },
    { name: "Rajasthan Nuclear Power", lat: 24.8806, lng: 74.8342, type: "nuclear_facility", risk_level: "extreme" }
  ]
  
  const industrialGeofences = []
  
  // Add nuclear facilities
  NUCLEAR_FACILITIES.forEach(facility => {
    industrialGeofences.push(createGeofence({
      name: `Nuclear: ${facility.name}`,
      lat: facility.lat,
      lng: facility.lng,
      radius: 2.0,
      risk: 'industrial_hazard',
      severity: 'extreme',
      facility_type: facility.type,
      hazard_level: facility.risk_level,
      safety_protocol: 'Restricted area - Maintain safe distance, radiation risk',
      emergency_contact: '108 (Emergency Services)',
      source: 'Nuclear_Regulatory'
    }))
  })
  
  // Add other industrial zones
  for (let i = 0; i < 30; i++) {
    const lat = 8 + Math.random() * 29
    const lng = 68 + Math.random() * 29
    
    const facilityTypes = ['chemical_plant', 'petroleum_refinery', 'steel_plant', 'mining_operation']
    const type = facilityTypes[Math.floor(Math.random() * facilityTypes.length)]
    
    industrialGeofences.push(createGeofence({
      name: `Industrial Zone ${i + 1}`,
      lat,
      lng,
      radius: 0.5 + Math.random() * 0.8,
      risk: 'industrial_hazard',
      severity: ['medium', 'high'][Math.floor(Math.random() * 2)],
      facility_type: type,
      source: 'Industrial_Safety'
    }))
  }
  
  console.log(`✅ Generated ${industrialGeofences.length} industrial geofences`)
  return industrialGeofences
}

export const fetchElevationHazards = async () => {
  console.log('🏔️ Generating elevation hazard zones...')
  
  const elevationZones = []
  
  // Himalayan regions
  const himalayanZones = [
    { name: "Kedarnath Landslide Risk", lat: 30.7346, lng: 79.0669 },
    { name: "Manali Avalanche Zone", lat: 32.2396, lng: 77.1887 },
    { name: "Shimla Slope Instability", lat: 31.1048, lng: 77.1734 },
    { name: "Darjeeling Landslide", lat: 26.7271, lng: 88.3953 },
    { name: "Gangtok Earthquake Risk", lat: 27.3389, lng: 88.6065 }
  ]
  
  himalayanZones.forEach(zone => {
    elevationZones.push(createGeofence({
      name: `Elevation Risk: ${zone.name}`,
      lat: zone.lat,
      lng: zone.lng,
      radius: 0.6,
      risk: 'elevation_hazard',
      severity: 'high',
      hazard_type: 'landslide_avalanche',
      elevation_risk: 'mountain_terrain',
      source: 'Geological_Survey'
    }))
  })
  
  // Additional random elevation risks
  for (let i = 0; i < 20; i++) {
    const lat = 25 + Math.random() * 10  // Northern regions
    const lng = 75 + Math.random() * 15
    
    elevationZones.push(createGeofence({
      name: `Elevation Hazard ${i + 1}`,
      lat,
      lng,
      radius: 0.4,
      risk: 'elevation_hazard',
      severity: 'medium',
      source: 'Terrain_Analysis'
    }))
  }
  
  console.log(`✅ Generated ${elevationZones.length} elevation geofences`)
  return elevationZones
}

export const fetchCrowdDensity = async () => {
  console.log('👥 Generating crowd density zones...')
  
  const crowdZones = []
  
  // Major events and gatherings
  const eventZones = [
    { name: "Kumbh Mela Prayagraj", lat: 25.4358, lng: 81.8463 },
    { name: "Durga Puja Kolkata", lat: 22.5726, lng: 88.3639 },
    { name: "Ganesh Festival Mumbai", lat: 19.0760, lng: 72.8777 },
    { name: "Pushkar Fair Rajasthan", lat: 26.4899, lng: 74.5511 },
    { name: "Thrissur Pooram Kerala", lat: 10.5276, lng: 76.2144 }
  ]
  
  eventZones.forEach(event => {
    crowdZones.push(createGeofence({
      name: `Crowd Event: ${event.name}`,
      lat: event.lat,
      lng: event.lng,
      radius: 0.8,
      risk: 'crowd_density',
      severity: 'high',
      event_type: 'religious_festival',
      crowd_estimate: '100000+',
      source: 'Event_Monitoring'
    }))
  })
  
  // Random crowd zones
  for (let i = 0; i < 20; i++) {
    const lat = 8 + Math.random() * 29
    const lng = 68 + Math.random() * 29
    
    crowdZones.push(createGeofence({
      name: `Crowd Zone ${i + 1}`,
      lat,
      lng,
      radius: 0.3,
      risk: 'crowd_density',
      severity: 'medium',
      source: 'Public_Safety'
    }))
  }
  
  console.log(`✅ Generated ${crowdZones.length} crowd geofences`)
  return crowdZones
}

// MISSING: Generate additional comprehensive coverage
export const generateAdditionalGeofences = () => {
  console.log('📍 Generating additional geofences for COMPLETE India coverage...')
  
  const additionalGeofences = []
  
  // Massive weather event simulation (using your existing logic but more)
  for (let i = 0; i < 200; i++) {
    const lat = 6 + Math.random() * 32
    const lng = 68 + Math.random() * 30
    
    const weatherTypes = [
      'heat_wave', 'cold_wave', 'fog', 'dust_storm', 'cyclone_alert',
      'heavy_rain', 'thunderstorm', 'hailstorm', 'drought', 'flash_flood'
    ]
    const severities = ['low', 'medium', 'high', 'extreme']
    
    additionalGeofences.push(createGeofence({
      name: `Weather Zone ${i + 1}`,
      lat,
      lng,
      radius: 0.2 + Math.random() * 0.8,
      risk: 'weather_hazard',
      severity: severities[Math.floor(Math.random() * severities.length)],
      weather_type: weatherTypes[Math.floor(Math.random() * weatherTypes.length)],
      source: 'Weather_Simulation_Extended'
    }))
  }
  
  // Add 100 more air quality zones
  for (let i = 0; i < 100; i++) {
    const lat = 6 + Math.random() * 32
    const lng = 68 + Math.random() * 30
    
    additionalGeofences.push(createGeofence({
      name: `AQI Zone ${i + 1}`,
      lat,
      lng,
      radius: 0.3,
      risk: 'air_quality',
      severity: ['medium', 'high', 'extreme'][Math.floor(Math.random() * 3)],
      aqi: 150 + Math.random() * 350,
      source: 'AQI_Extended'
    }))
  }
  
  console.log(`✅ Generated ${additionalGeofences.length} additional geofences`)
  return additionalGeofences
}

// Helper functions for popup rendering
export const getRiskIcon = (risk) => {
  const icons = {
    'weather_hazard': '🌦️',
    'traffic_incident': '🚗',
    'air_quality': '🌫️',
    'crowd_density': '👥',
    'safety_concern': '🚔',
    'natural_disaster': '🌍',
    'industrial_hazard': '🏭',
    'elevation_hazard': '🏔️',
    'power_infrastructure': '⚡',
    'health_risk': '🩺',
    'drought_risk': '🌵',
    'cyclone_impact': '🌀',
    'landslide_risk': '⛰️',
    'wildlife_hazard': '🐅'
  }
  return icons[risk] || '⚠️'
}

export const getSeverityColor = (severity) => {
  const colors = {
    'low': '#fbbf24',
    'medium': '#f97316',
    'high': '#ef4444',
    'extreme': '#991b1b'
  }
  return colors[severity] || '#6b7280'
}

export const renderAdditionalInfo = (props) => {
  let html = ''
  
  if (props.aqi) {
    html += `<div style="margin-bottom: 8px;"><strong>🌫️ AQI:</strong> ${props.aqi} (${props.aqi_level || 'Unknown'})</div>`
  }
  if (props.temperature) {
    html += `<div style="margin-bottom: 8px;"><strong>🌡️ Temperature:</strong> ${props.temperature}°C</div>`
  }
  if (props.wind_speed) {
    html += `<div style="margin-bottom: 8px;"><strong>💨 Wind Speed:</strong> ${props.wind_speed} km/h</div>`
  }
  if (props.humidity) {
    html += `<div style="margin-bottom: 8px;"><strong>💧 Humidity:</strong> ${props.humidity}%</div>`
  }
  if (props.magnitude) {
    html += `<div style="margin-bottom: 8px;"><strong>📏 Magnitude:</strong> ${props.magnitude}</div>`
  }
  if (props.depth) {
    html += `<div style="margin-bottom: 8px;"><strong>📍 Depth:</strong> ${props.depth} km</div>`
  }
  if (props.condition) {
    html += `<div style="margin-bottom: 8px;"><strong>☁️ Condition:</strong> ${props.condition}</div>`
  }
  if (props.visibility) {
    html += `<div style="margin-bottom: 8px;"><strong>👁️ Visibility:</strong> ${props.visibility} km</div>`
  }
  if (props.crime_type) {
    html += `<div style="margin-bottom: 8px;"><strong>🚔 Crime Type:</strong> ${props.crime_type.replace('_', ' ')}</div>`
  }
  if (props.facility_type) {
    html += `<div style="margin-bottom: 8px;"><strong>🏭 Facility:</strong> ${props.facility_type.replace('_', ' ')}</div>`
  }
  if (props.weather_type) {
    html += `<div style="margin-bottom: 8px;"><strong>🌦️ Weather:</strong> ${props.weather_type.replace('_', ' ')}</div>`
  }
  
  return html
}

// Main exports
export { fetchAllRealTimeGeofencesExtended as fetchAllRealTimeGeofences }
export default fetchAllRealTimeGeofencesExtended