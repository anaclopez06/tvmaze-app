import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  Image,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  StyleSheet,
  useWindowDimensions,
} from 'react-native';

export default function ListaSeries({ navigation }) {
  const [series, setSeries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [erro, setErro] = useState(null);
  const { width } = useWindowDimensions();

  let colunas = 2;
  if (width > 1000) colunas = 6;
  else if (width > 700) colunas = 4;
  else if (width > 500) colunas = 3;

  const larguraCard = (width - 16 - colunas * 12) / colunas;

  useEffect(() => {
    async function carregarSeries() {
      try {
        const resposta = await fetch('https://api.tvmaze.com/shows');
        if (!resposta.ok) {
          throw new Error(`Erro ${resposta.status}`);
        }
        const dados = await resposta.json();
        setSeries(dados);
      } catch (e) {
        setErro('Não foi possível carregar as séries. Verifique sua conexão.');
      } finally {
        setLoading(false);
      }
    }

    carregarSeries();
  }, []);

  if (loading) {
    return (
      <View style={styles.centro}>
        <ActivityIndicator size="large" color="#ff4d6d" />
        <Text style={styles.texto}>Carregando séries...</Text>
      </View>
    );
  }

  if (erro) {
    return (
      <View style={styles.centro}>
        <Text style={styles.erro}>{erro}</Text>
      </View>
    );
  }

  function renderItem({ item }) {
    const imagem = item.image?.medium;
    const nota = item.rating?.average;

    return (
      <TouchableOpacity
        style={[styles.card, { width: larguraCard }]}
        onPress={() =>
          navigation.navigate('DetalheSerie', {
            id: item.id,
            nome: item.name,
            imagem: imagem,
          })
        }
      >
        {imagem ? (
          <Image
            source={{ uri: imagem }}
            style={[styles.imagem, { height: larguraCard * 1.45 }]}
          />
        ) : (
          <View
            style={[
              styles.imagem,
              styles.semImagem,
              { height: larguraCard * 1.45 },
            ]}
          >
            <Text style={styles.semImagemTexto}>Sem imagem</Text>
          </View>
        )}

        {nota ? (
          <View style={styles.nota}>
            <Text style={styles.notaTexto}>★ {nota}</Text>
          </View>
        ) : null}

        <View style={styles.info}>
          <Text style={styles.nome} numberOfLines={1}>
            {item.name}
          </Text>
        </View>
      </TouchableOpacity>
    );
  }

  return (
    <FlatList
      key={colunas}
      data={series}
      keyExtractor={(item) => String(item.id)}
      renderItem={renderItem}
      numColumns={colunas}
      contentContainerStyle={styles.lista}
      ListEmptyComponent={
        <Text style={styles.texto}>Nenhuma série encontrada.</Text>
      }
    />
  );
}

const styles = StyleSheet.create({
  centro: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#14141f',
  },
  texto: {
    marginTop: 10,
    color: '#aaa',
    textAlign: 'center',
  },
  erro: {
    color: '#ff6b6b',
    fontSize: 16,
    textAlign: 'center',
  },
  lista: {
    padding: 8,
  },
  card: {
    margin: 6,
    backgroundColor: '#1f1f2e',
    borderRadius: 10,
    overflow: 'hidden',
  },
  imagem: {
    width: '100%',
  },
  semImagem: {
    backgroundColor: '#2c2c3e',
    justifyContent: 'center',
    alignItems: 'center',
  },
  semImagemTexto: {
    color: '#888',
  },
  nota: {
    position: 'absolute',
    top: 8,
    right: 8,
    backgroundColor: 'rgba(0,0,0,0.75)',
    borderRadius: 6,
    paddingHorizontal: 6,
    paddingVertical: 2,
  },
  notaTexto: {
    color: '#ffd166',
    fontSize: 12,
    fontWeight: 'bold',
  },
  info: {
    padding: 10,
  },
  nome: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '700',
  },
});