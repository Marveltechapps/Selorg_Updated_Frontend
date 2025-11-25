import React, { Suspense } from 'react';
import { View, StyleSheet, ActivityIndicator } from 'react-native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../types/navigation';

// Critical screens - load immediately
import SplashScreen from '../screens/SplashScreen';
import NoInternet from '../screens/NoInternet';
import Login from '../screens/Login';

// Lazy load other screens for better performance
const Onboarding = React.lazy(() => import('../screens/Onboarding'));
const OTPVerification = React.lazy(() => import('../screens/OTPVerification'));
const VerificationSuccess = React.lazy(() => import('../screens/VerificationSuccess'));
const MainTabNavigator = React.lazy(() => import('./MainTabNavigator'));
const OrderStatusStack = React.lazy(() => import('./OrderStatusStack'));
const Settings = React.lazy(() => import('../screens/Settings'));
const OrdersStack = React.lazy(() => import('./OrdersStack'));
const CustomerSupportStack = React.lazy(() => import('./CustomerSupportStack'));
const LocationStack = React.lazy(() => import('./LocationStack'));
const RefundsStack = React.lazy(() => import('./RefundsStack'));
const Profile = React.lazy(() => import('../screens/Profile'));
const PaymentManagement = React.lazy(() => import('../screens/PaymentManagement'));
const GeneralInfoStack = React.lazy(() => import('./GeneralInfoStack'));
const Notifications = React.lazy(() => import('../screens/Notifications'));
const Checkout = React.lazy(() => import('../screens/Checkout'));
const Coupons = React.lazy(() => import('../screens/Coupons'));
const Home = React.lazy(() => import('../screens/Home'));
const Category = React.lazy(() => import('../screens/Category'));
const Search = React.lazy(() => import('../screens/Search'));
const SearchResults = React.lazy(() => import('../screens/SearchResults'));
const ProductDetail = React.lazy(() => import('../screens/ProductDetail'));
const CategoryProducts = React.lazy(() => import('../screens/CategoryProducts'));
const BannerDetail = React.lazy(() => import('../screens/BannerDetail'));
const TinyTimmies = React.lazy(() => import('../screens/TinyTimmies'));
const CategoriesExpo = React.lazy(() => import('../screens/CategoriesExpo'));

// Loading fallback component
const LoadingFallback = () => (
  <View style={styles.loadingContainer}>
    <ActivityIndicator size="large" color="#007AFF" />
  </View>
);

// Wrapper component for lazy-loaded screens
const LazyScreen = ({ component: Component, ...props }: any) => (
  <Suspense fallback={<LoadingFallback />}>
    <Component {...props} />
  </Suspense>
);

const Stack = createNativeStackNavigator<RootStackParamList>();

const AppNavigator: React.FC = () => {
  return (
    <View style={styles.container}>
      <Stack.Navigator
        initialRouteName="Splash"
        screenOptions={{
          headerShown: false,
          animation: 'slide_from_right',
          gestureEnabled: true,
        }}
      >
        <Stack.Screen 
          name="Splash" 
          component={SplashScreen}
          options={{
            animation: 'none', // No animation for splash screen
            gestureEnabled: false, // Prevent swipe back from splash
          }}
        />
        <Stack.Screen name="Onboarding" component={(props: any) => <LazyScreen component={Onboarding} {...props} />} />
        <Stack.Screen name="NoInternet" component={NoInternet} />
        <Stack.Screen name="Login" component={Login} />
        <Stack.Screen name="OTPVerification" component={(props: any) => <LazyScreen component={OTPVerification} {...props} />} />
        <Stack.Screen 
          name="VerificationSuccess" 
          component={(props: any) => <LazyScreen component={VerificationSuccess} {...props} />}
          options={{
            animation: 'none', // No animation for success screen
            gestureEnabled: false, // Prevent swipe back
          }}
        />
        <Stack.Screen 
          name="MainTabs" 
          component={(props: any) => <LazyScreen component={MainTabNavigator} {...props} />}
          options={{
            headerShown: false,
            gestureEnabled: false, // Prevent swipe back from main tabs
          }}
        />
        <Stack.Screen name="Checkout" component={(props: any) => <LazyScreen component={Checkout} {...props} />} />
        <Stack.Screen name="OrderStatus" component={(props: any) => <LazyScreen component={OrderStatusStack} {...props} />} />
        <Stack.Screen name="Settings" component={(props: any) => <LazyScreen component={Settings} {...props} />} />
        <Stack.Screen name="Orders" component={(props: any) => <LazyScreen component={OrdersStack} {...props} />} />
        <Stack.Screen name="CustomerSupport" component={(props: any) => <LazyScreen component={CustomerSupportStack} {...props} />} />
        <Stack.Screen name="Addresses" component={(props: any) => <LazyScreen component={LocationStack} {...props} />} />
        <Stack.Screen name="Refunds" component={(props: any) => <LazyScreen component={RefundsStack} {...props} />} />
        <Stack.Screen name="Profile" component={(props: any) => <LazyScreen component={Profile} {...props} />} />
        <Stack.Screen name="PaymentManagement" component={(props: any) => <LazyScreen component={PaymentManagement} {...props} />} />
        <Stack.Screen name="GeneralInfo" component={(props: any) => <LazyScreen component={GeneralInfoStack} {...props} />} />
        <Stack.Screen name="Notifications" component={(props: any) => <LazyScreen component={Notifications} {...props} />} />
        <Stack.Screen name="Coupons" component={(props: any) => <LazyScreen component={Coupons} {...props} />} />
        <Stack.Screen name="Home" component={(props: any) => <LazyScreen component={Home} {...props} />} />
        <Stack.Screen name="Category" component={(props: any) => <LazyScreen component={Category} {...props} />} />
        <Stack.Screen name="Search" component={(props: any) => <LazyScreen component={Search} {...props} />} />
        <Stack.Screen name="SearchResults" component={(props: any) => <LazyScreen component={SearchResults} {...props} />} />
        <Stack.Screen name="ProductDetail" component={(props: any) => <LazyScreen component={ProductDetail} {...props} />} />
        <Stack.Screen name="CategoryProducts" component={(props: any) => <LazyScreen component={CategoryProducts} {...props} />} />
        <Stack.Screen name="BannerDetail" component={(props: any) => <LazyScreen component={BannerDetail} {...props} />} />
        <Stack.Screen name="TinyTimmies" component={(props: any) => <LazyScreen component={TinyTimmies} {...props} />} />
        <Stack.Screen name="CategoriesExpo" component={(props: any) => <LazyScreen component={CategoriesExpo} {...props} />} />
      </Stack.Navigator>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5F5F5',
  },
});

export default AppNavigator;

