export type RootStackParamList = {
  Home: undefined;
  Practice: { 
    technique: string; 
    duration: number;
    musicEnabled: boolean; // Add this
    volume: number;        // Add this
  };
};