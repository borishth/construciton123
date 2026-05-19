import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { ArrowRight } from 'lucide-react-native';
import Svg, { Path } from 'react-native-svg';

const TopoPattern = () => (
  <Svg
    style={StyleSheet.absoluteFill}
    viewBox="0 0 700 550"
    preserveAspectRatio="xMidYMid slice"
  >
    {[
      'M-20,80 C60,60 120,140 200,100 C280,60 320,150 400,110 C460,80 500,160 560,120',
      'M-20,140 C50,110 130,200 210,155 C290,110 340,210 420,165 C480,130 520,220 580,175',
      'M-20,200 C70,165 140,260 230,210 C310,165 360,270 440,220 C510,180 545,280 600,235',
      'M-30,280 C60,240 150,330 240,280 C330,230 370,340 460,285 C520,250 560,350 620,300',
      'M-30,360 C80,315 160,410 260,355 C350,305 400,410 490,360 C555,320 590,420 640,370',
      'M10,430 C100,385 180,480 280,430 C370,380 420,480 510,430 C580,395 615,480 670,445',
      'M-10,500 C90,455 170,550 270,500 C360,455 415,555 510,500 C580,460 620,550 680,510',
      'M150,120 C180,90 230,95 250,130 C270,165 240,200 200,195 C160,190 130,150 150,120 Z',
      'M60,300 C90,265 145,270 165,310 C185,350 155,390 110,385 C65,380 35,335 60,300 Z',
      'M300,200 C340,170 395,175 415,215 C435,255 400,295 355,288 C310,280 270,230 300,200 Z',
      'M230,380 C265,345 320,352 338,395 C356,438 322,472 278,465 C235,458 200,415 230,380 Z',
      'M380,320 C415,288 468,296 485,338 C502,380 470,415 426,408 C382,400 348,353 380,320 Z',
    ].map((d, i) => (
      <Path
        key={i}
        d={d}
        stroke="rgba(255,255,255,0.25)"
        strokeWidth="1.5"
        fill="none"
      />
    ))}
  </Svg>
);

const WaveDivider = () => (
  <Svg
    style={{ position: 'absolute', bottom: -1, left: 0, width: '100%', height: 90 }}
    viewBox="0 0 1000 90"
    preserveAspectRatio="none"
  >
    <Path
      d="M0,40 C250,90 600,0 1000,55 L1000,90 L0,90 Z"
      fill="#F5F0EF"
    />
  </Svg>
);

export default function StartupScreen() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      {/* Coral hero section */}
      <View style={styles.heroSection}>
        <TopoPattern />
        <WaveDivider />
      </View>

      {/* White content section */}
      <View style={styles.contentSection}>
        <View>
          <Text style={styles.title}>Welcome</Text>
          <Text style={styles.description}>
            Welcome to ConstructHub, your smart solution for construction inspection and quality management.{'\n\n'}
            Designed to simplify your workflow, it helps you reduce time, minimize manual effort, and stay organized on every project.{'\n\n'}
            Create checklists, track progress, and ensure high-quality standards efficiently, all in one place.
          </Text>
        </View>

        {/* Continue button */}
        <View style={styles.buttonContainer}>
          <Text style={styles.continueText}>Continue</Text>
          <TouchableOpacity
            onPress={() => router.push('/(auth)/login')}
            style={styles.button}
            activeOpacity={0.8}
            accessibilityLabel="Continue to Login"
          >
            <ArrowRight color="white" size={24} strokeWidth={2.5} />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F0EF',
  },
  heroSection: {
    height: '58%',
    width: '100%',
    backgroundColor: '#F07E7E',
    overflow: 'hidden',
    position: 'relative',
  },
  contentSection: {
    flex: 1,
    paddingHorizontal: 28,
    paddingTop: 24,
    paddingBottom: 32,
    justifyContent: 'space-between',
  },
  title: {
    fontSize: 38,
    fontWeight: '800',
    color: '#2D2D2D',
    letterSpacing: -0.5,
  },
  description: {
    fontSize: 15,
    color: '#9E9E9E',
    lineHeight: 22,
    marginTop: 10,
  },
  buttonContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    gap: 12,
  },
  continueText: {
    fontSize: 16,
    color: '#2D2D2D',
    fontWeight: '500',
  },
  button: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: '#F07E7E',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#F07E7E',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 8,
    elevation: 5,
  },
});
