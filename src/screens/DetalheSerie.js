import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  Image,
  FlatList,
  ActivityIndicator,
  StyleSheet,
} from 'react-native';

export default function DetalheSerie({ route }) {
  const { id, nome, imagem } = route.params;

  const [episodios, setEpisodios] = useState([]);
  const [loading, setLoading] = useState(true);
  const [erro, setErro] = useState(null);

  useEffect(() => {
    async function carregarEpisodios() {
      try {
        const resposta = await fetch(`https://api.tvmaze.com/shows/${id}/episodes`);
        if (!resposta.ok) {
          throw new Error(`Erro ${resposta.status}`);
        }
        const dados = await resposta.json();
        setEpisodios(dados);
      } catch (e) {
        setErro('Não foi possível carregar os episódios. Tente novamente.');
      } finally {
        setLoading(false);
      }
    }

    carregarEpisodios();
  }, [id]);

  if (loading) {
    return (
      <View style={styles.centro}>
        <ActivityIndicator size="large" color="#ff4d6d" />
        <Text style={styles.texto}>Carregando episódios...</Text>
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

  function renderEpisodio({ item }) {
    return (
      <View style={styles.episodio}>
        <View style={styles.badge}>
          <Text style={styles.badgeTexto}>T{item.season}</Text>
          <Text style={styles.badgeTexto}>E{item.number ?? '-'}</Text>
        </View>
        <View style={styles.episodioInfo}>
          <Text style={styles.info}>
            Temporada {item.season} •{' '}
            {item.number ? `Episódio ${item.number}` : 'Especial'}
          </Text>
          <Text style={styles.nomeEpisodio}>{item.name}</Text>
        </View>
      </View>
    );
  }

  const cabecalho = (
    <View style={styles.cabecalho}>
      {imagem ? (
        <Image source={{ uri: imagem }} style={styles.capa} />
      ) : (
        <View style={[styles.capa, styles.semImagem]}>
          <Text style={styles.texto}>Sem imagem</Text>
        </View>
      )}
      <View style={styles.cabecalhoTexto}>
        <Text style={styles.titulo}>{nome}</Text>
        <Text style={styles.subtitulo}>{episodios.length} episódios</Text>
      </View>
    </View>
  );

  return (
    <FlatList
      data={episodios}
      keyExtractor={(item) => String(item.id)}
      renderItem={renderEpisodio}
      ListHeaderComponent={cabecalho}
      contentContainerStyle={styles.lista}
      ListEmptyComponent={
        <Text style={styles.texto}>Nenhum episódio encontrado.</Text>
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
  lista: {
    padding: 12,
  },
  cabecalho: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  capa: {
    width: 110,
    height: 160,
    borderRadius: 10,
  },
  semImagem: {
    backgroundColor: '#2c2c3e',
    justifyContent: 'center',
    alignItems: 'center',
  },
  cabecalhoTexto: {
    flex: 1,
    marginLeft: 14,
    justifyContent: 'center',
  },
  titulo: {
    color: '#fff',
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 6,
  },
  subtitulo: {
    color: '#aaa',
    fontSize: 14,
  },
  texto: {
    color: '#aaa',
    textAlign: 'center',
    marginTop: 10,
  },
  erro: {
    color: '#ff6b6b',
    fontSize: 16,
    textAlign: 'center',
  },
  episodio: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1f1f2e',
    padding: 12,
    borderRadius: 10,
    marginBottom: 8,
  },
  badge: {
    backgroundColor: '#ff4d6d',
    borderRadius: 8,
    paddingVertical: 6,
    paddingHorizontal: 10,
    alignItems: 'center',
    marginRight: 12,
    minWidth: 48,
  },
  badgeTexto: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
  },
  episodioInfo: {
    flex: 1,
  },
  info: {
    fontSize: 12,
    color: '#9a9ab0',
    marginBottom: 2,
  },
  nomeEpisodio: {
    fontSize: 15,
    fontWeight: '600',
    color: '#fff',
  },
});