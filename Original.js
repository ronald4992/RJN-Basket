import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  StyleSheet
} from "react-native";
import { Picker } from "@react-native-picker/picker";

export default function Original() {

  const drafts = {
    "2018": [
      "Deandre Ayton","Marvin Bagley III","Luka Doncic","Jaren Jackson Jr.","Trae Young",
      "Mohamed Bamba","Wendell Carter Jr","Collin Sexton","Kevin Knox","Mikal Bridges"
    ],
    "2011": [
      "Kyrie Irving","Derrick Williams","Enes Kanter","Tristan Thompson","Jonas Valanciunas",
      "Jan Vesely","Bismack Biyombo","Brandon Knight","Kemba Walker","Jimmer Fredette"
    ],
    "2015": [
      "Karl-Anthony Towns","D'Angelo Russell","Jahlil Okafor","Kristaps Porzingis",
      "Mario Hezonja","Willie Cauley-Stein","Emmanuel Mudiay","Stanley Johnson",
      "Frank Kaminsky","Justise Winslow"
    ],
    "2020": [
      "Anthony Edwards","James Wiseman","LaMelo Ball","Patrick Williams","Isaac Okoro",
      "Onyeka Okongwu","Killian Hayes","Obi Toppin","Deni Avdija","Jalen Smith"
    ],
    "2023": [
      "Victor Wembanyama","Brandon Miller","Scoot Henderson","Amen Thompson",
      "Ausar Thompson","Anthony Black","Bilal Coulibaly","Jarace Walker",
      "Taylor Hendricks","Cason Wallace"
    ]
  };

  const [año, setAño] = useState("2018");
  const [draft, setDraft] = useState(drafts["2018"]);
  const [input, setInput] = useState("");
  const [sugerencias, setSugerencias] = useState([]);
  const [adivinados, setAdivinados] = useState([]);
  const [mensaje, setMensaje] = useState("");

  // 🔄 cambiar draft
  useEffect(() => {
    setDraft(drafts[año]);
    setAdivinados([]);
    setMensaje("");
    setInput("");
    setSugerencias([]);
  }, [año]);

  // 🔥 AUTOCOMPLETE
  useEffect(() => {
    if (input.length < 2) {
      setSugerencias([]);
      return;
    }

    const timeout = setTimeout(async () => {
      try {
        const res = await fetch(`https://api.balldontlie.io/v1/players?search=${input}`, {
          headers: {
            Authorization: "63365c64-f024-42e5-bf26-56d1e6600ca0"
          }
        });

        if (!res.ok) return;

        const data = await res.json();
        setSugerencias(data.data.slice(0, 5));

      } catch (error) {
        console.log(error);
      }
    }, 400);

    return () => clearTimeout(timeout);

  }, [input]);

  // ✅ verificar
  const verificar = () => {
    const texto = input.toLowerCase();
    if (!texto) return;

    const jugadorCorrecto = draft.find(j =>
      j.toLowerCase().includes(texto)
    );

    if (jugadorCorrecto) {
      if (!adivinados.includes(jugadorCorrecto)) {
        setAdivinados([...adivinados, jugadorCorrecto]);
        setMensaje("Correcto");
      } else {
        setMensaje("Ya lo habías adivinado");
      }
    } else {
      setMensaje("No es del draft");
    }

    setInput("");
    setSugerencias([]);
  };

  return (
    <View style={styles.container}>

      <Text style={styles.title}>Adivina el Draft NBA</Text>

      <Picker
        selectedValue={año}
        onValueChange={(itemValue) => setAño(itemValue)}
        style={styles.picker}
      >
        {Object.keys(drafts).map((year) => (
          <Picker.Item key={year} label={`Draft ${year}`} value={year} />
        ))}
      </Picker>

      <TextInput
        style={styles.input}
        value={input}
        onChangeText={setInput}
        placeholder="Escribe un jugador..."
        placeholderTextColor="#aaa"
      />

      <TouchableOpacity style={styles.button} onPress={verificar}>
        <Text style={styles.buttonText}>Adivinar</Text>
      </TouchableOpacity>

      {/* SUGERENCIAS */}
      <FlatList
        data={sugerencias}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item }) => {
          const nombre = item.first_name + " " + item.last_name;

          return (
            <TouchableOpacity
              style={styles.suggestion}
              onPress={() => {
                setInput(nombre);
                setSugerencias([]);
              }}
            >
              <Text style={{ color: "white" }}>{nombre}</Text>
            </TouchableOpacity>
          );
        }}
      />

      <Text style={styles.mensaje}>{mensaje}</Text>

      {/* LISTA */}
      <FlatList
        data={draft}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item }) => (
          <View style={styles.item}>
            <Text style={{ color: "white" }}>
              {adivinados.includes(item) ? item : "?"}
            </Text>
          </View>
        )}
      />

    </View>
  );
}

// 🎨 TODO EL ESTILO AQUÍ MISMO
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#111",
    padding: 20
  },
  title: {
    color: "white",
    fontSize: 24,
    textAlign: "center",
    marginBottom: 20
  },
  picker: {
    backgroundColor: "#222",
    color: "white",
    marginBottom: 10
  },
  input: {
    backgroundColor: "#222",
    color: "white",
    padding: 10,
    marginBottom: 10
  },
  button: {
    backgroundColor: "#444",
    padding: 10,
    alignItems: "center",
    marginBottom: 10
  },
  buttonText: {
    color: "white"
  },
  suggestion: {
    padding: 8,
    backgroundColor: "#222",
    marginVertical: 2
  },
  mensaje: {
    color: "white",
    textAlign: "center",
    marginVertical: 10
  },
  item: {
    backgroundColor: "#222",
    padding: 10,
    marginVertical: 5,
    alignItems: "center"
  }
});