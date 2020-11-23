import React, {useEffect, useState} from 'react';
import {
  SafeAreaView,
  Text,
  View,
  StyleSheet,
  ImageBackground,
} from 'react-native';
import Voice from '@react-native-community/voice';
import {TouchableOpacity} from 'react-native-gesture-handler';
import {IconButton} from 'react-native-paper';
import {Conversation} from 'react-native-watson';

export default function HomeScreen() {
  const [pitch, setPitch] = useState('');
  const [error, setError] = useState('');
  const [end, setEnd] = useState('');
  const [started, setStarted] = useState('');
  const [results, setResults] = useState([]);
  const [partialResults, setPartialResults] = useState([]);

  useEffect(() => {
    Voice.onSpeechStart = onSpeechStart;
    Voice.onSpeechEnd = onSpeechEnd;
    Voice.onSpeechResults = onSpeechResults;
    Voice.onSpeechPartialResults = onSpeechPartialResults;
    Voice.onSpeechError = onSpeechError;
    Voice.onSpeechVolumeChanged = onSpeechVolumeChanged;

    return () => {
      Voice.destroy().then(Voice.removeAllListeners);
    };
  }, []);

  Conversation.initialize('roy.rachit@ithands.com', 'Justsayit@123');
  let workspaceId = 'your_workspace_id';

  // To start the conversation, send a message with only the workspaceId
  Conversation.message(workspaceId).then((response) => {
    console.log(JSON.stringify(response));
    this.setState({output: response.output.text, context: response.context});
  });

  let input = {
    text: this.state.text,
    context: this.state.context,
  };

  Conversation.message(workspaceId, input).then((response) => {
    console.log(JSON.stringify(response));
    this.setState({output: response.output.text, context: response.context});
  });

  const onSpeechStart = (e) => {
    console.log('Started');
    setStarted('√');
  };

  const onSpeechEnd = (e) => {
    console.log('Ended');
    setEnd('√');
  };

  const onSpeechResults = (e) => {
    console.log('Results');
    setResults(e.value);
  };

  const onSpeechPartialResults = (e) => {
    console.log('Partial');
    setPartialResults(e.value);
  };

  const onSpeechError = (e) => {
    console.log('Stopped');
    setError(e.value);
  };

  const onSpeechVolumeChanged = (e) => {
    console.log('Chnage');
    setPitch(e.value);
  };

  const startRecording = async () => {
    try {
      await Voice.start('en-US');
      setPitch('');
      setError('');
      setStarted('');
      setResults([]);
      setPartialResults([]);
      setEnd('');
    } catch (err) {
      console.log(err);
    }
  };
  const stopRecording = async () => {
    try {
      await Voice.stop();
    } catch (err) {
      console.log(err);
    }
  };

  const cancelRecognizing = async () => {
    try {
      await Voice.cancel();
    } catch (e) {
      console.error(e);
    }
  };

  const destroyRecognizer = async () => {
    try {
      await Voice.destroy();
      setPitch('');
      setError('');
      setStarted('');
      setResults([]);
      setPartialResults([]);
      setEnd('');
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <SafeAreaView style={{flex: 1, backgroundColor: 'white'}}>
      <ImageBackground
        source={require('../assets/mike.png')}
        style={styles.img}
        imageStyle={{resizeMode: 'contain'}}>
        <View>
          <Text style={{alignSelf: 'center', fontSize: 20}}>
            Press on microphone icon to start speaking
          </Text>
        </View>
        <View style={styles.data}>
          <View>
            <Text style={{alignSelf: 'center', fontSize: 20, margin: 10}}>
              Started:{started}
            </Text>
            <Text style={{alignSelf: 'center', fontSize: 20, margin: 10}}>
              Ended:{end}
            </Text>
          </View>
          <View>
            <Text style={{alignSelf: 'center', fontSize: 20, margin: 10}}>
              Pitch:{pitch}
            </Text>
            <Text
              style={{
                alignSelf: 'center',
                fontSize: 20,
                margin: 10,
              }}>
              Error:{error}
            </Text>
          </View>
        </View>
        <View style={styles.icon}>
          <IconButton
            icon="microphone"
            color={'black'}
            size={20}
            style={styles.microphone}
            onPress={startRecording}
          />
        </View>
        <View style={styles.results}>
          <Text style={{alignSelf: 'center', fontSize: 20}}>Results</Text>
          <Text> {results}</Text>
        </View>

        {/* <View style={styles.partialResults}>
          <Text style={{alignSelf: 'center', fontSize: 20}}>
            Partial Results
          </Text>
          <Text> {partialResults}</Text>
        </View> */}
        <View style={styles.btn}>
          <TouchableOpacity onPress={stopRecording}>
            <Text>Stop</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={cancelRecognizing}>
            <Text>Cancel</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={destroyRecognizer}>
            <Text>Destroy</Text>
          </TouchableOpacity>
        </View>
      </ImageBackground>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  img: {
    flex: 1,
  },
  data: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 20,
    marginHorizontal: 20,
  },

  microphone: {
    alignSelf: 'center',
  },
  results: {
    flex: 2,
    justifyContent: 'center',
  },
  partialResults: {
    flex: 2,
    justifyContent: 'center',
  },
  btn: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 20,
    backgroundColor: 'orange',
  },
});
