import React, {useState,  useEffect} from 'react'; 
import { Text, StyleSheet, View, TextInput, ScrollView, Alert } from 'react-native';
import { Card,Icon , Avatar } from 'react-native-elements';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { NavigationContainer } from '@react-navigation/native';
import * as Clipboard from 'expo-clipboard';
import * as FileSystem from 'expo-file-system';

const Drawer = createDrawerNavigator();

//Salesforce/codet5p-220m-py is only for python code generation
const API_URL = 'https://api-inference.huggingface.co/models/Salesforce/codet5p-220m-py'; 

// Screen defination
function HomeScreen({ navigation }) {
  const [value, setValue] = useState(''); // Stores the current input
  const [cards, setCards] = useState([]); // state for the cards list
  const [inputText, setInputText] = useState('');  // User input for text generation
  const [outputText, setOutputText] = useState('');  // output from model

  // Hugging Face API Key 
  const apiKey = 'Your-Api-key';

  // Function to add a new card with the current input value and an additional black card
  const addCard = async () => {
    if (value.trim()) {
      const generatedText = await generateText(inputText);
      const newCard = { id: cards.length + 1, content: value, generatedText: generatedText, isBlackCard: false };
      const blackCard = { id: cards.length + 2, content: '', generatedText: '', isBlackCard: true };

      // Add both the new card and the black card
      setCards([...cards, newCard, blackCard]);
      setValue(''); // Clear the input field after adding the card
      setInputText(''); // Reset input text
      setOutputText(generatedText);
    }
  };

  // Function to generate text using Hugging Face Inference API
  const generateText = async (inputText) => {
    if (!inputText.trim()) {
      Alert.alert('Please enter some input text');
      return 'No text generated';
    }

    try {
      const response = await fetch(API_URL, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          inputs: inputText,  //user input to the model
          parameters: {
            max_length: 1000, 
            do_sample: true,  
            temperature: 0.1, 
          }
        }),
      });

      const data = await response.json();

      if (data && data[0] && data[0].generated_text) {
        return data[0].generated_text;
      } else if (data.error) {
        console.error('Error from API:', data.error);
        Alert.alert('Error from API', data.error);
        return 'Error generating text';
      } else {
        return 'No text generated';
      }
    } catch (error) {
      console.error('Error fetching data from Hugging Face API:', error); 
      Alert.alert('Error generating text', error.message);
      return 'Error generating text';
    }
  };

  const handleAddCardAndGenerate = async () => {
    await addCard(); 
  };

  return (
    <SafeAreaProvider>
      <View style={styles.Container}>
        <Text style={styles.title}>Optimize Code Generator</Text>
        
        <View style={styles.codeView}>
          <ScrollView style={styles.scrollContainer} contentContainerStyle={styles.scrollContentContainer}>
            <View style={{alignItems: 'flex-end', padding: 13}}>
              <Icon
                name="history"
                type="font-awesome"
                size={30}
                color="black"
                onPress={() => navigation.navigate('History')}
              />
            </View>
            {cards.map((card, index) => (
              <Card
                key={index}
                containerStyle={[
                  styles.baseCardStyle,
                  card.isBlackCard ? styles.blackCardStyle : styles.cardStyle,
                  { minHeight: card.content.length > 50 ? 100 : 130 },
                ]}
              > 
                {card.isBlackCard && (
                  <Icon
                    reverse
                    name="copy"
                    type="ionicon"
                    color="black"
                    size={15}
                    onPress={() => { Clipboard.setString(outputText); }}
                  />
                )}
                
                <Text style={card.isBlackCard ? { color: 'white' } : { color: 'black' }}>
                  {card.isBlackCard ? outputText : card.content}
                </Text>
              </Card>
            ))}
          </ScrollView>
        </View>

        <View style={styles.cardView}>
          <Icon
            reverse
            name="code"
            type="ionicon"
            color="black"
            onPress={() => console.log('copied!')}
          />

          <TextInput
            editable
            multiline
            numberOfLines={3}
            maxLength={4000}
            onChangeText={text => {
              setValue(text); 
              setInputText(text);
            }}
            value={value} // current input value
            placeholder="Describe your code..."
            placeholderTextColor="white"
            style={styles.textInput}
          />

          <Icon
            reverse
            name="arrow-up"
            type="ionicon"
            color="black"
            onPress={handleAddCardAndGenerate}
          />
        </View>
      </View>
    </SafeAreaProvider>
  );
}

function Profile () {
  return (
    <SafeAreaProvider>
    <View style={styles.profileContainer}>
      <Avatar
        rounded
        size="xlarge"
        icon={{ name: 'user', color: 'grey', type: 'font-awesome' }}
        onPress={() => console.log("Avatar Pressed!")}
        activeOpacity={0.7}
        containerStyle={{ backgroundColor: 'white' }}
      />
    </View>
      <View>
        <Text style={styles.title}>User Name</Text>
      </View>
    </SafeAreaProvider>
  );
}

function History () {
  return (
    <SafeAreaProvider>
    <View style={styles.historyContainer}>
      <Text></Text>
    </View>
    </SafeAreaProvider>
  );
}

function Settings () {
  return (
    <SafeAreaProvider>
    <View style={styles.historyContainer}>
      <Text></Text>
    </View>
    </SafeAreaProvider>
  );
}

//Navigations
export default function App() {
 return (
    <NavigationContainer>
     <Drawer.Navigator
        initialRouteName="Home"
        screenOptions={({ navigation }) => ({
          headerStyle: {
            backgroundColor: 'black',
          },
          headerTintColor: '#fff',
          headerTitleStyle: {
            fontWeight: 'bold', 
          },
        })}
      >
        <Drawer.Screen name="Profile" component={Profile}
        options={{
          drawerLabel: () => (
            <View style={{ flexDirection: '', alignItems: 'center'}}>
              <Icon
                name="user"
                type="font-awesome"
                size={70}
                color="black"
              />
            </View>
          ),
        }} />
        <Drawer.Screen name="Home" component={HomeScreen}
        options={{
          drawerLabel: () => (
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <Icon
                name="home"
                type="font-awesome"
                size={20}
                color="black"
              />
              <Text style={{ marginLeft: 10 }}>Home</Text>
            </View>
          ),
        }} />
        <Drawer.Screen name="History" component={History}
        options={{
          drawerLabel: () => (
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <Icon
                name="history"
                type="font-awesome"
                size={20}
                color="black"
              />
              <Text style={{ marginLeft: 10 }}>History</Text>
            </View>
          ),
        }}/>
        
        <Drawer.Screen name="Settings" 
        options={{
          drawerLabel: () => (
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <Icon
                name="gear"
                type='font-awesome'
                size={25}
                color="black"
              />
              <Text style={{ marginLeft: 10 }}>Setting</Text>
            </View>
          ),
        }}/>
        <Drawer.Screen name="Feedback"
        options={{
          drawerLabel: () => (
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <Icon
                name="comment"
                type='font-awesome'
                size={25}
                color="black"
              />
              <Text style={{ marginLeft: 10 }}>Feedback</Text>
            </View>
          ),
        }}/>
        <Drawer.Screen name="Logout"
        options={{
          drawerLabel: () => (
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <Icon
                name="enter"
                type='ionicon'
                size={25}
                color="red"
              />
              <Text style={{ marginLeft: 10 }}>Logout</Text>
            </View>
          ),
        }}/>
      </Drawer.Navigator>
    </NavigationContainer>
  );
}

// Styles
const styles = StyleSheet.create({
  Container: {
    flex: 1,
    justifyContent: 'flex-start',
    padding: 0,
  },
  profileContainer:
  {
    justifyContent: 'center',
    alignItems:'center',
    backgroundColor:'lightblue',
    padding:0,
  },

  title: {
    margin: 11,
    fontSize: 30,
    fontWeight: 'bold',
    textAlign: 'center',
    color: 'black',
  },
  subTitle: {
    fontSize: 23,
    color: 'grey',
    fontWeight: 'bold',
    margin:19,
  },
  scrollContainer: {
    flex :1,
  },
  scrollContentContainer: {
  paddingBottom: 150,
  },
  cardView: {
    position: 'absolute', // Fixes the input area to the bottom
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'white',
    flexDirection: 'row',
    padding: 1,
    alignItems: 'center',
    borderRadius: 50,
    margin:2,
  },
  textInput: {
    flex: 1,
    padding: 5,
    fontSize: 15,
    backgroundColor: 'white',
    borderRadius: 30,
    alignContent:'center',
    color:'black',
  },
  codeView: {
    flex:1,
    backgroundColor: '',
    borderRadius: 30,
    margin:3, 
    
    },
  cardStyle: {
    borderRadius: 30, 
    backgroundColor: 'white',
    elevation: 5, //shadow effect on Android
    shadowColor: 'grey', // shadow for iOS
    shadowOffset: { width: 3, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    
  },
  blackCardStyle: {
    borderRadius: 30,
    overflow: 'hidden',
    backgroundColor: 'black',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    color:'white',
    flexDirection:'row',
  },
  historyContainer: {
    flex:1,
    backgroundColor:'',

  },
});
