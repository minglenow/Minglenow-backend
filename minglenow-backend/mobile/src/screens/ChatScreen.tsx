import React, { useEffect, useState } from 'react';
import { View, TextInput, Button, FlatList, Text } from 'react-native';
import { io } from 'socket.io-client';

export default function ChatScreen({ route }: any) {
  const token = route.params.token;
  const [socket, setSocket] = useState<any>(null);
  const [messages, setMessages] = useState<any[]>([]);
  const [text, setText] = useState('');

  useEffect(() => {
    const s = io('http://localhost:4000', { auth: { token } });
    setSocket(s);
    s.on('connect', () => console.log('connected'));
    s.on('message', (m: any) => setMessages((prev) => [...prev, m]));

    return () => s.disconnect();
  }, []);

  const send = () => {
    socket.emit('send_message', { matchId: 'demo', content: text, metadata: {} });
    setText('');
  };

  return (
    <View style={{ flex: 1 }}>
      <FlatList data={messages} renderItem={({ item }) => <Text>{item.content}</Text>} keyExtractor={(i) => i.id} />
      <TextInput value={text} onChangeText={setText} />
      <Button title="Send" onPress={send} />
    </View>
  );
}