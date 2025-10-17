import React, { useEffect, useState, useRef } from 'react';
import { View, Text, Button } from 'react-native';
import Swiper from 'react-native-deck-swiper';
import axios from 'axios';

export default function HomeScreen({ navigation, route }: any) {
  const token = route.params?.token;
  const [cards, setCards] = useState<any[]>([]);

  useEffect(() => {
    (async () => {
      const res = await axios.get('http://localhost:4000/api/matches/candidates', { params: { userId: 'demo' } });
      setCards(res.data.candidates || []);
    })();
  }, []);

  const onSwipedRight = (index: number) => {
    const user = cards[index];
    axios.post('http://localhost:4000/api/matches/like', { from: 'demo', to: user.id });
  };

  return (
    <View style={{ flex: 1 }}>
      <Swiper
        cards={cards}
        renderCard={(card) => (
          <View style={{ backgroundColor: 'white', borderRadius: 8, padding: 20 }}>
            <Text>{card.display_name}</Text>
            <Text>{card.bio}</Text>
          </View>
        )}
        onSwipedRight={onSwipedRight}
      />
      <Button title="Open Chat" onPress={() => navigation.navigate('Chat', { token })} />
    </View>
  );
}