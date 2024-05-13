import React from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import Navbarlight from '../Navigation/navbarlight';
import Fundo from '../Navigation/fundo';
import { View, Text, StyleSheet, Image } from 'react-native';

function CheckUserProgress({ navigation, route }) {
  return (
    <SafeAreaView style={styles.container}>
      <Navbarlight navigation={navigation} />
      <View style={{ flex: 1 }}>
        <Text style={{ margin: 10, fontSize: 30, fontWeight: 'bold' }}>{route.params.nome}</Text>
        <Text style={{ margin: 10, fontSize: 15, fontWeight: 'bold' }}>Estatisticas treino</Text>
        <Text style={{ margin: 10, fontSize: 15, fontWeight: 'bold' }}>Velocidade: 120%</Text>
        <Text style={{ margin: 10, fontSize: 15, fontWeight: 'bold' }}>Força: 80%</Text>
        <Text style={{ margin: 10, fontSize: 15, fontWeight: 'bold' }}>peso: +10KG</Text>

      </View>
      <View style={{ alignItems: 'center' }}>
        <Image
          style={{ marginBottom: 50 }} // Adjust marginBottom as needed to position the image closer to the bottom
          source={require('../assets/fotofinal.png')}
        />
      </View>
      <Fundo navigation={navigation} />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
    justifyContent: 'space-between',
  },
});

export default CheckUserProgress;
