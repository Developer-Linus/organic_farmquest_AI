import { View, Text } from 'react-native';

export default function Index() {
  console.log('🔄 Index.tsx - Simple test component loaded');
  
  return (
    <View style={{ 
      flex: 1, 
      justifyContent: 'center', 
      alignItems: 'center', 
      backgroundColor: '#E8F5E8' 
    }}>
      <Text style={{ 
        fontSize: 24, 
        fontWeight: 'bold', 
        color: '#22c55e',
        marginBottom: 20
      }}>
        🌱 Organic FarmQuest AI
      </Text>
      <Text style={{ 
        fontSize: 16, 
        color: '#5D4E37',
        textAlign: 'center',
        paddingHorizontal: 40
      }}>
        Custom App is Loading Successfully!
      </Text>
      <Text style={{ 
        fontSize: 14, 
        color: '#666',
        marginTop: 20
      }}>
        This is NOT the default Expo welcome page
      </Text>
    </View>
  );
}
