#include <WiFi.h>
#include <HTTPClient.h>
#include "HX711.h"
#include <Wire.h>
#include <Adafruit_GFX.h>
#include <Adafruit_SSD1306.h>
const char* WIFI_SSID="Wokwi-GUEST"; const char* WIFI_PASS="";
// Configure these three values only for your Firebase deployment. Never commit a production secret.
const char* INGEST_URL="https://asia-south1-YOUR_PROJECT_ID.cloudfunctions.net/ingestScaleTelemetry";
const char* USER_UID="YOUR_FIREBASE_AUTH_UID";
const char* DEVICE_KEY="YOUR_DEVICE_INGEST_KEY";
#define DT 16
#define SCK 4
#define LED 2
HX711 scale; Adafruit_SSD1306 display(128,64,&Wire,-1); unsigned long lastSend=0;
float simulatedWeight(){return 68.0 + 2.0*sin(millis()/9000.0);}
void setup(){Serial.begin(115200);pinMode(LED,OUTPUT);scale.begin(DT,SCK);Wire.begin(21,22);display.begin(SSD1306_SWITCHCAPVCC,0x3C);WiFi.begin(WIFI_SSID,WIFI_PASS);Serial.print("Connecting WiFi");while(WiFi.status()!=WL_CONNECTED){delay(250);Serial.print('.');}Serial.println("\nWiFi connected");}
void loop(){float kg=simulatedWeight();display.clearDisplay();display.setTextColor(SSD1306_WHITE);display.setTextSize(1);display.setCursor(0,0);display.println("NutriCloud Smart Scale");display.setTextSize(2);display.setCursor(0,22);display.printf("%.1f kg",kg);display.setTextSize(1);display.setCursor(0,50);display.println("Cloud: ONLINE");display.display();
 if(millis()-lastSend>5000){lastSend=millis();HTTPClient http;http.begin(INGEST_URL);http.addHeader("Content-Type","application/json");http.addHeader("x-device-key",DEVICE_KEY);String body=String("{\"uid\":\"")+USER_UID+"\",\"deviceId\":\"ESP32-SCALE-001\",\"weightKg\":"+String(kg,1)+",\"batteryPct\":95}";int code=http.POST(body);Serial.printf("Weight: %.1f kg | HTTP status: %d\n",kg,code);if(code>=200&&code<300)digitalWrite(LED,HIGH);else digitalWrite(LED,LOW);http.end();}delay(50);}
