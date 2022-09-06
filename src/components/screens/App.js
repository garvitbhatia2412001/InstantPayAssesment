import React, { useState } from 'react';
import {
    SafeAreaView,
    StyleSheet,
    Text,
    View,
    TouchableOpacity,
    Image,
    ScrollView,
} from 'react-native';

import {
    launchImageLibrary
} from 'react-native-image-picker';

import CryptoJS from "crypto-js";

const App = () => {
    const [filePath, setFilePath] = useState([]);

    const data = 'plainText';
    const iv = 'yourivare1234567';
    const key = 'ab821eb4b7d352cd65e84c5a7f38dbb0966262c651cf7064a0d821d8b2a20a5a';

    const fkey = CryptoJS.enc.Utf8.parse(key);
    const fiv = CryptoJS.enc.Utf8.parse(iv);

    const enc = CryptoJS.AES.encrypt(data, fkey, {
        iv: fiv,
        mode: CryptoJS.mode.CBC,
        padding: CryptoJS.pad.Pkcs7,
    });

    const final = enc.ciphertext.toString(CryptoJS.enc.Base64);
    const decr = CryptoJS.AES.decrypt(final, fkey, {
        iv: fiv,
        mode: CryptoJS.mode.CBC,
        padding: CryptoJS.pad.Pkcs7,
    });

    const str2 = CryptoJS.enc.Utf8.stringify(decr);

    const getTokenApi = () => {
        try {
            var myHeaders = new Headers();
            myHeaders.append("Accept", "application/json");
            myHeaders.append("Content-Type", "application/json");

            var raw = JSON.stringify({
                "ciphertext": final
            });

            var requestOptions = {
                method: 'POST',
                headers: myHeaders,
                body: raw,
                redirect: 'follow'
            };

            fetch("https://www.instantpay.in/ws/AndroidRecruitmentTest/getToken", requestOptions)
                .then((response) => {
                    response.text();
                })
                .then((result) => {
                    console.log("Result---", result)
                })
                .catch(error => console.log('Error-----', error));
        } catch (err) {
            console.log("Catch Error --- ", err);
        }
    }

    getTokenApi();

    const chooseFile = (type) => {
        let options = {
            mediaType: type,
            maxWidth: 300,
            maxHeight: 550,
            quality: 1,
        };
        launchImageLibrary(options, (response) => {
            console.log('Response = ', response);

            if (response.didCancel) {
                alert('User cancelled camera picker');
                return;
            } else if (response.errorCode == 'camera_unavailable') {
                alert('Camera not available on device');
                return;
            } else if (response.errorCode == 'permission') {
                alert('Permission not satisfied');
                return;
            } else if (response.errorCode == 'others') {
                alert(response.errorMessage);
                return;
            }
            console.log("Response assets -- ", response.assets[0].uri);
            setFilePath([...filePath, response.assets[0].uri]);
        });
    };

    const handleRemove = (index) => {
        const reducedArr = [...filePath];
        reducedArr.splice(index, 1);
        setFilePath(reducedArr);
    }

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: '#000' }}>
            <View style={{ height: 30 }} />
            <Text style={styles.titleText}>
                Encryption/Decryption
            </Text>
            <View style={styles.encView}>
                <Text style={styles.textEnc}>{`Plain Text ---> ${data}`}</Text>
                <Text style={styles.textEnc}>{`Encryption ---> ${final}`}</Text>
                <Text style={styles.textEnc}>{`Decryption ---> ${str2}`}</Text>
            </View>
            <View style={{ height: 30 }} />
            <TouchableOpacity
                activeOpacity={0.5}
                style={styles.buttonStyle}
                onPress={() => chooseFile('photo')}>
                <View style={styles.buttonView}>
                    <Text style={styles.textStyle}>Choose Image</Text>
                </View>
            </TouchableOpacity>
            <ScrollView>
                {filePath.length > 0 &&
                    filePath.map((ele, index) => (
                        <View key={ele} style={[styles.image, { flexDirection: 'row', justifyContent: 'space-around' }]}>
                            <Image
                                resizeMode="cover"
                                resizeMethod="scale"
                                style={{ width: 150, height: 150 }}
                                source={{ uri: ele }}
                            />
                            <TouchableOpacity style={styles.crossTouchable} onPress={() => { handleRemove(index) }}>
                                <View style={{ justifyContent: 'center', alignItems: 'center', }}>
                                    <Text style={styles.crossText}>X</Text>
                                </View>
                            </TouchableOpacity>
                        </View>
                    ))}
            </ScrollView>
        </SafeAreaView>
    );
};

export default App;

const styles = StyleSheet.create({
    encView: {
        flexDirection: 'column', justifyContent: 'center', alignItems: 'center', borderWidth: 3, borderColor: '#000', borderRadius: 2, backgroundColor: 'orange', height: '15%', width: '90%', alignSelf: 'center'
    },
    textEnc: { fontWeight: 'bold', color: '#fff' },
    container: {
        backgroundColor: '#fff',
        alignItems: 'center',
    },
    image: {
        marginVertical: 24,
        alignItems: 'center',
    },
    buttonView: { backgroundColor: 'orange', width: '50%', alignSelf: 'center', justifyContent: 'center', alignItems: 'center', borderRadius: 20, borderColor: '#fff', borderWidth: 1 },
    titleText: {
        fontSize: 22,
        fontWeight: 'bold',
        textAlign: 'center',
        paddingVertical: 20,
        color: '#fff'
    },
    textStyle: {
        padding: 10,
        textAlign: 'center',
        color: '#fff', fontWeight: 'bold', fontSize: 15
    },
    buttonStyle: {
        width: '100%', marginTop: 30, alignSelf: 'center'
    },
    imageStyle: {
        width: 200,
        height: 200,
        margin: 5,
    },
    crossTouchable: { width: 50, height: 50, backgroundColor: 'red', borderRadius: 50 },
    crossText: { color: '#000', fontSize: 20, fontWeight: 'bold', marginTop: 10 }
});