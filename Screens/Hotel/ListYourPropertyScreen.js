import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  Platform,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons, FontAwesome6 } from 'react-native-vector-icons';
import DateTimePicker from '@react-native-community/datetimepicker';
import { useNavigation } from '@react-navigation/native';
import * as ImagePicker from 'expo-image-picker';
import { useNotifications } from '../../context/MessageNotificationContext';
import EmployerFooter from '../../components/EmployerFooter';
import Footer from '../../components/Footer';
import BorderButton from '../../components/BorderButton';
import GradientButton from '../../components/GradientButton';
import useHotelEvents from './HotelEvent/useHotelEvents';
import { toastError, toastSuccess } from '../../utils/toast';
import DiscardChangesModal from './HotelModals/DiscardChangesModal';
import HotelPageHeader from '../../components/HotelPageHeader';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { formatDateDisplay, formatDateForApi } from "./HotelUtils/HotelFormatDates";
import { MAX_IMAGES, MAX_IMAGE_SIZE_BYTES, MAX_CANCELLATION_DAYS, MAX_ROOMS, MAX_PRICE, DEFAULT_COMMISSION, FACILITY_OPTIONS, } from "./HotelUtils/HotelConstants"
import {
  sanitizeDecimalText,
  enforcePriceMax,
  finalFromBase,
  baseFromFinal,
} from "./HotelUtils/HotelPriceUtils";

export default function ListYourPropertyScreen({ route }) {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation();
  const { admin } = useNotifications();
  const { saveHotelRoom, getHotelBooking } = useHotelEvents();
  const bookingId = route?.params?.bookingId ?? null;
  const isEditMode = !!bookingId;

  const commission = route?.params?.commission || DEFAULT_COMMISSION;

  // Room overview
  const [roomType, setRoomType] = useState('');
  const [numberOfRooms, setNumberOfRooms] = useState('');

  const [customerWeekdayPrice, setCustomerWeekdayPrice] = useState('');
  const [customerWeekendPrice, setCustomerWeekendPrice] = useState('');
  const [weekdayRate, setWeekdayRate] = useState('');
  const [weekendRate, setWeekendRate] = useState('');

  const isUpdatingPriceRef = useRef(false);
  const priceErrorShownRef = useRef(false);

  const [cancelRowErrors, setCancelRowErrors] = useState([false, false, false]);
  const hasCancellationError = cancelRowErrors.some(Boolean);
  const [cancellationPolicy, setCancellationPolicy] = useState([
    { before: '', refund: '' },
    { before: '', refund: '' },
    { before: '', refund: '' },
  ]);

  // Facilities
  const [selectedFacilities, setSelectedFacilities] = useState([]);
  const [customFacilities, setCustomFacilities] = useState([]);
  const [showAddCategory, setShowAddCategory] = useState(false);
  const [newCategoryText, setNewCategoryText] = useState('');

  // Discount — optional, no validation
  const [discountPercent, setDiscountPercent] = useState('');
  const [fromDate, setFromDate] = useState(null);
  const [toDate, setToDate] = useState(null);
  const [showFromPicker, setShowFromPicker] = useState(false);
  const [showToPicker, setShowToPicker] = useState(false);

  // Description
  const [description, setDescription] = useState('');

  // Photos
  // `images`: newly-picked local files -> { uri, fileSize }, uploaded as room_photos[]
  // `existingImages`: S3 URL strings already saved on the room, sent back as existing_images
  const [images, setImages] = useState([]);
  const [existingImages, setExistingImages] = useState([]);

  const allFacilities = [...FACILITY_OPTIONS, ...customFacilities];
  const [submitting, setSubmitting] = useState(false);

  // ---- Edit-mode prefill ----
  const [loadingExisting, setLoadingExisting] = useState(isEditMode);
  const originalSnapshotRef = useRef(null); // JSON snapshot of fetched state, for accurate dirty-check

  useEffect(() => {
    if (!bookingId) return;
    let isMounted = true;

    (async () => {
      try {
        setLoadingExisting(true);
        const json = await getHotelBooking(bookingId);
        const b = json.result;
        if (!isMounted) return;

        let facilities = [];
        try {
          facilities = b.facility_category ? JSON.parse(b.facility_category) : [];
        } catch (e) {
          facilities = [];
        }

        let rules = [];
        try {
          rules = b.refund_rules ? JSON.parse(b.refund_rules) : [];
        } catch (e) {
          rules = [];
        }

        // Any facility saved on the room that isn't one of our default chips
        // was custom-added by the owner — surface it as a chip too, or it'll
        // silently disappear from the UI even though it's still selected.
        const unknown = facilities.filter((f) => !FACILITY_OPTIONS.includes(f));
        if (unknown.length) {
          setCustomFacilities((prev) => [...new Set([...prev, ...unknown])]);
        }

        const nextRoomType = b.room_type ?? '';
        const nextNumberOfRooms = String(b.number_of_rooms ?? '');
        const nextCustomerWeekdayPrice = b.customer_weekday_rate ?? '';
        const nextCustomerWeekendPrice = b.customer_weekend_rate ?? '';
        const nextWeekdayRate = b.weekday_rate ?? '';
        const nextWeekendRate = b.weekend_rate ?? '';
        const nextDescription = b.description ?? '';
        const nextDiscountPercent = b.discount != null ? String(b.discount) : '';
        const nextFromDate = b.discount_from ? new Date(b.discount_from) : null;
        const nextToDate = b.discount_to ? new Date(b.discount_to) : null;
        const nextCancellationPolicy = [
          rules[0] ?? { before: '', refund: '' },
          rules[1] ?? { before: '', refund: '' },
          rules[2] ?? { before: '', refund: '' },
        ];
        const nextExistingImages = Array.isArray(b.images) ? b.images : [];

        setRoomType(nextRoomType);
        setNumberOfRooms(nextNumberOfRooms);
        setCustomerWeekdayPrice(nextCustomerWeekdayPrice);
        setCustomerWeekendPrice(nextCustomerWeekendPrice);
        setWeekdayRate(nextWeekdayRate);
        setWeekendRate(nextWeekendRate);
        setDescription(nextDescription);
        setDiscountPercent(nextDiscountPercent);
        setFromDate(nextFromDate);
        setToDate(nextToDate);
        setSelectedFacilities(facilities);
        setCancellationPolicy(nextCancellationPolicy);
        setExistingImages(nextExistingImages);

        // Snapshot AFTER setting state — this is what the dirty-check compares against,
        // so the discard-changes modal doesn't fire just because prefill happened.
        originalSnapshotRef.current = JSON.stringify({
          roomType: nextRoomType,
          numberOfRooms: nextNumberOfRooms,
          customerWeekdayPrice: nextCustomerWeekdayPrice,
          customerWeekendPrice: nextCustomerWeekendPrice,
          weekdayRate: nextWeekdayRate,
          weekendRate: nextWeekendRate,
          description: nextDescription,
          discountPercent: nextDiscountPercent,
          fromDate: nextFromDate ? nextFromDate.getTime() : null,
          toDate: nextToDate ? nextToDate.getTime() : null,
          selectedFacilities: facilities,
          cancellationPolicy: nextCancellationPolicy,
          existingImages: nextExistingImages,
          newImagesCount: 0,
        });
      } catch (err) {
        toastError(err.message || 'Failed to load room details.');
        navigation.goBack();
      } finally {
        if (isMounted) setLoadingExisting(false);
      }
    })();

    return () => {
      isMounted = false;
    };
  }, [bookingId]);

  const [showDiscardModal, setShowDiscardModal] = useState(false);
  const pendingActionRef = useRef(null);
  const confirmedLeaveRef = useRef(false);
  const isDirtyRef = useRef(false);

  useEffect(() => {
    if (isEditMode) {
      if (!originalSnapshotRef.current) {
        isDirtyRef.current = false;
        return;
      }
      const current = JSON.stringify({
        roomType,
        numberOfRooms,
        customerWeekdayPrice,
        customerWeekendPrice,
        weekdayRate,
        weekendRate,
        description,
        discountPercent,
        fromDate: fromDate ? fromDate.getTime() : null,
        toDate: toDate ? toDate.getTime() : null,
        selectedFacilities,
        cancellationPolicy,
        existingImages,
        newImagesCount: images.length,
      });
      isDirtyRef.current = current !== originalSnapshotRef.current;
    } else {
      isDirtyRef.current =
        roomType.trim() !== '' ||
        numberOfRooms !== '' ||
        customerWeekdayPrice !== '' ||
        customerWeekendPrice !== '' ||
        weekdayRate !== '' ||
        weekendRate !== '' ||
        cancellationPolicy.some((row) => row.before !== '' || row.refund !== '') ||
        selectedFacilities.length > 0 ||
        discountPercent !== '' ||
        fromDate !== null ||
        toDate !== null ||
        description.trim() !== '' ||
        images.length > 0;
    }
  });

  useEffect(() => {
    const unsubscribe = navigation.addListener('beforeRemove', (e) => {
      if (confirmedLeaveRef.current || !isDirtyRef.current) {
        return;
      }
      e.preventDefault();
      pendingActionRef.current = e.data.action;
      setShowDiscardModal(true);
    });
    return unsubscribe;
  }, [navigation]);

  const handleDiscardConfirm = () => {
    confirmedLeaveRef.current = true;
    setShowDiscardModal(false);
    if (pendingActionRef.current) {
      navigation.dispatch(pendingActionRef.current);
    } else {
      navigation.goBack();
    }
  };

  const handleDiscardCancel = () => {
    pendingActionRef.current = null;
    setShowDiscardModal(false);
  };

  const toggleFacility = (facility) => {
    setSelectedFacilities((prev) =>
      prev.includes(facility)
        ? prev.filter((f) => f !== facility)
        : [...prev, facility]
    );
  };

  const handleAddCategory = () => {
    const trimmed = newCategoryText.trim();
    if (!trimmed) {
      setShowAddCategory(false);
      return;
    }
    if (!allFacilities.includes(trimmed)) {
      setCustomFacilities((prev) => [...prev, trimmed]);
      setSelectedFacilities((prev) => [...prev, trimmed]);
    }
    setNewCategoryText('');
    setShowAddCategory(false);
  };

  // Number of Rooms — max 500
  const handleRoomsChange = (text) => {
    let filtered = text.replace(/[^0-9]/g, '');
    if (filtered) {
      const num = parseInt(filtered, 10);
      if (num > MAX_ROOMS) {
        toastError('Maximum limit is 500 rooms.');
        filtered = String(MAX_ROOMS);
      }
    }
    setNumberOfRooms(filtered);
  };

  const handleDecimalChange = (text, setter) => {
    // digits + at most one decimal point
    let filtered = text.replace(/[^0-9.]/g, '');
    const parts = filtered.split('.');
    if (parts.length > 2) {
      filtered = parts[0] + '.' + parts.slice(1).join('');
    }
    setter(filtered);
  };

  const showPriceLimitError = () => {
    if (!priceErrorShownRef.current) {
      toastError('Maximum allowed amount is 100,000 CAD');
      priceErrorShownRef.current = true;
      setTimeout(() => {
        priceErrorShownRef.current = false;
      }, 2000);
    }
  };

  const handleBasePriceChange = (text, setBase, setFinal) => {
    if (isUpdatingPriceRef.current) return;
    isUpdatingPriceRef.current = true;

    let filtered = sanitizeDecimalText(text);
    const num = parseFloat(filtered);

    if (!isNaN(num)) {
      const clamped = enforcePriceMax(num);
      if (clamped !== num) {
        showPriceLimitError();
        filtered = String(clamped);
      }
      setBase(filtered);
      setFinal(finalFromBase(clamped, commission).toFixed(2));
    } else {
      setBase(filtered);
      setFinal('');
    }

    isUpdatingPriceRef.current = false;
  };

  const handleFinalPriceChange = (text, setFinal, setBase) => {
    if (isUpdatingPriceRef.current) return;
    isUpdatingPriceRef.current = true;

    let filtered = sanitizeDecimalText(text);
    const num = parseFloat(filtered);

    if (!isNaN(num)) {
      const clamped = enforcePriceMax(num);
      if (clamped !== num) {
        showPriceLimitError();
        filtered = String(clamped);
      }
      setFinal(filtered);
      setBase(baseFromFinal(clamped, commission).toFixed(2));
    } else {
      setFinal(filtered);
      setBase('');
    }

    isUpdatingPriceRef.current = false;
  };

  // Cancellation Policy handlers
  const handleCancelDayChange = (index, text) => {
    let filtered = text.replace(/[^0-9]/g, '');
    if (filtered) {
      let num = parseInt(filtered, 10);
      if (num > MAX_CANCELLATION_DAYS) num = MAX_CANCELLATION_DAYS;
      filtered = String(num);
    }
    setCancellationPolicy((prev) => {
      const updated = [...prev];
      updated[index] = { ...updated[index], before: filtered };
      return updated;
    });
  };

  const handleCancelRefundChange = (index, text) => {
    let filtered = text.replace(/[^0-9.]/g, '');
    const parts = filtered.split('.');
    if (parts.length > 2) {
      filtered = parts[0] + '.' + parts.slice(1).join('');
    }
    if (filtered && !filtered.endsWith('.')) {
      const num = parseFloat(filtered);
      if (!isNaN(num) && num > 100) filtered = '100';
    }
    setCancellationPolicy((prev) => {
      const updated = [...prev];
      updated[index] = { ...updated[index], refund: filtered };
      return updated;
    });
  };

  const validateCancellationPolicy = () => {
    const collected = [];
    const originalIndices = [];

    cancellationPolicy.forEach((row, idx) => {
      const before = row.before.trim();
      const refund = row.refund.trim();
      if (before !== '' || refund !== '') {
        collected.push({ before, refund });
        originalIndices.push(idx);
      }
    });

    setCancelRowErrors([false, false, false]);
    if (collected.length > 1) {
      const parsed = collected.map((rule) => ({
        before: parseInt(rule.before, 10),
        refund: parseFloat(rule.refund),
      }));

      for (let i = 0; i < parsed.length; i++) {
        if (
          isNaN(parsed[i].before) ||
          isNaN(parsed[i].refund) ||
          parsed[i].before <= 0 ||
          parsed[i].before > MAX_CANCELLATION_DAYS ||
          parsed[i].refund < 0 ||
          parsed[i].refund > 100
        ) {
          const errs = [false, false, false];
          errs[originalIndices[i]] = true;
          setCancelRowErrors(errs);
          toastError('Days must be between 1–100 and refund percentage between 0–100.');
          return { valid: false, refundRules: [] };
        }
      }

      const withOriginalIndex = parsed.map((p, i) => ({
        ...p,
        originalIndex: originalIndices[i],
      }));
      withOriginalIndex.sort((a, b) => b.before - a.before);

      for (let i = 0; i < withOriginalIndex.length - 1; i++) {
        const current = withOriginalIndex[i];
        const next = withOriginalIndex[i + 1];
        if (current.refund < next.refund) {
          const errs = [false, false, false];
          errs[current.originalIndex] = true;
          errs[next.originalIndex] = true;
          setCancelRowErrors(errs);
          toastError('For more days before check-in, you must offer a higher refund percentage.');
          return { valid: false, refundRules: [] };
        }
      }
    }

    const refundRules = collected.map((row) => ({
      before: row.before,
      refund: row.refund,
    }));
    return { valid: true, refundRules };
  };

  // Date pickers
  const onFromDateChange = (event, selectedDate) => {
    setShowFromPicker(Platform.OS === 'ios');
    if (event.type === 'dismissed') {
      setShowFromPicker(false);
      return;
    }
    if (selectedDate) setFromDate(selectedDate);
    if (Platform.OS === 'android') setShowFromPicker(false);
  };

  const onToDateChange = (event, selectedDate) => {
    setShowToPicker(Platform.OS === 'ios');
    if (event.type === 'dismissed') {
      setShowToPicker(false);
      return;
    }
    if (selectedDate) setToDate(selectedDate);
    if (Platform.OS === 'android') setShowToPicker(false);
  };

  // ---- Photos: unified handling of existing (S3) + newly-picked (local) images ----

  const totalPhotoCount = images.length + existingImages.length;

  // Single list the UI renders from — combines both sources into one shape
  // so the gallery looks continuous, while keeping the underlying arrays
  // separate for submission (existing_images vs room_photos[]).
  const combinedPhotos = [
    ...existingImages.map((url, idx) => ({ key: `existing-${idx}`, type: 'existing', index: idx, uri: url })),
    ...images.map((img, idx) => ({ key: `new-${idx}-${img.uri}`, type: 'new', index: idx, uri: img.uri })),
  ];

  const removePhoto = (item) => {
    if (item.type === 'existing') {
      setExistingImages((prev) => prev.filter((_, i) => i !== item.index));
    } else {
      setImages((prev) => prev.filter((_, i) => i !== item.index));
    }
  };

  const handlePickImages = async () => {
    if (totalPhotoCount >= MAX_IMAGES) {
      toastError(`You can only upload up to ${MAX_IMAGES} photos.`);
      return;
    }

    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      toastError('Please allow photo library access to upload images.');
      return;
    }

    const remainingSlots = MAX_IMAGES - totalPhotoCount;
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsMultipleSelection: true,
      selectionLimit: remainingSlots,
      quality: 0.8,
    });

    if (result.canceled) return;

    const accepted = [];
    const rejectedTooLarge = [];

    result.assets.forEach((asset) => {
      const size = asset.fileSize || 0;
      if (size && size > MAX_IMAGE_SIZE_BYTES) {
        rejectedTooLarge.push(asset.fileName || 'image');
      } else {
        accepted.push({ uri: asset.uri, fileSize: size });
      }
    });

    if (rejectedTooLarge.length > 0) {
      toastError(`${rejectedTooLarge.length} photo(s) exceed the 3MB limit and were not added.`);
    }

    setImages((prev) => [...prev, ...accepted].slice(0, MAX_IMAGES - existingImages.length));
  };

  const handleCreate = async () => {
    if (!roomType.trim()) {
      toastError('Room type is required.');
      return;
    }

    if (!numberOfRooms) {
      toastError('Number of rooms is required.');
      return;
    }

    if (!customerWeekdayPrice || !customerWeekendPrice || !weekdayRate || !weekendRate) {
      toastError('Please fill in all pricing fields.');
      return;
    }

    const { valid, refundRules } = validateCancellationPolicy();
    if (!valid) return;

    if (selectedFacilities.length === 0) {
      toastError('Please select at least one facility.');
      return;
    }

    if (!description.trim()) {
      toastError('Room Description is required.');
      return;
    }

    if (images.length + existingImages.length === 0) {
      toastError('Please upload at least one room photo.');
      return;
    }

    try {
      setSubmitting(true);

      const result = await saveHotelRoom({
        bookingId,
        roomType,
        numberOfRooms,
        customerWeekdayPrice,
        customerWeekendPrice,
        weekdayRate,
        weekendRate,
        discountPercent,
        discountFrom: formatDateForApi(fromDate),
        discountTo: formatDateForApi(toDate),
        description,
        selectedFacilities,
        existingImages,
        images,
        refundRules,
      });

      toastSuccess(result.message || (isEditMode ? 'Property updated successfully' : 'Property listing saved successfully'));
      confirmedLeaveRef.current = true;
      navigation.goBack();
    } catch (err) {
      toastError(err.message || 'Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleCancel = () => {
    navigation?.goBack?.();
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <HotelPageHeader
        navigation={navigation}
        title={isEditMode ? 'EDIT PROPERTY' : 'LIST YOUR PROPERTY'}
      />
      <View style={styles.container}>
        {
          loadingExisting ? (
            <View style={styles.loadingWrap}>
              <ActivityIndicator size="large" color="#D17B68" />
            </View>
          ) : (
            <KeyboardAwareScrollView
              enableOnAndroid={true}
              enableAutomaticScroll={true}
              keyboardShouldPersistTaps="handled"
              showsVerticalScrollIndicator={false}
              extraScrollHeight={80}
              contentContainerStyle={styles.scrollContent}
            >
              <Text style={styles.sectionTitle}>Room Overview</Text>
              <Text style={styles.label}>Room Type</Text>
              <TextInput
                style={styles.input}
                value={roomType}
                onChangeText={setRoomType}
                placeholder="Ex. Deluxe"
                placeholderTextColor="#B0B0B0"
              />

              <Text style={styles.label}>Number of Rooms in this Category</Text>
              <TextInput
                style={[styles.input, { marginBottom: 0 }]}
                value={numberOfRooms}
                onChangeText={handleRoomsChange}
                keyboardType="number-pad"
                placeholder="Ex. 10"
                placeholderTextColor="#B0B0B0"
              />

              {/* Pricing */}
              <View style={styles.sectionTitleRow}>
                <Text style={styles.sectionTitle}>Pricing</Text>
                <Text style={styles.sectionSubtitle}>(You can change this later)</Text>
              </View>

              <View style={styles.priceGrid}>
                <View style={styles.priceRowPair}>
                  <View style={styles.priceColHalf}>
                    <Text style={styles.label}>Room price (Weekdays)</Text>
                    <View style={styles.priceInputRow}>
                      <View style={styles.currencyPrefix}>
                        <FontAwesome6 name="dollar" size={16} color="#7a7a7a" />
                      </View>
                      <TextInput
                        style={styles.priceInput}
                        value={customerWeekdayPrice}
                        onChangeText={(t) =>
                          handleBasePriceChange(t, setCustomerWeekdayPrice, setWeekdayRate)
                        }
                        keyboardType="decimal-pad"
                        placeholder="e.g. 2000.00"
                        placeholderTextColor="#B0B0B0"
                      />
                    </View>
                  </View>

                  <View style={styles.priceColHalf}>
                    <Text style={styles.label}>Room price (Fri and Sat)</Text>
                    <View style={styles.priceInputRow}>
                      <View style={styles.currencyPrefix}>
                        <FontAwesome6 name="dollar" size={16} color="#7a7a7a" />
                      </View>
                      <TextInput
                        style={styles.priceInput}
                        value={customerWeekendPrice}
                        onChangeText={(t) =>
                          handleBasePriceChange(t, setCustomerWeekendPrice, setWeekendRate)
                        }
                        keyboardType="decimal-pad"
                        placeholder="e.g. 4000.00"
                        placeholderTextColor="#B0B0B0"
                      />
                    </View>
                  </View>
                </View>
                <View style={[styles.priceRowPair, { marginTop: 12 }]}>
                  <View style={styles.priceColHalf}>
                    <Text style={styles.label}>Amount you'll get (Weekdays)</Text>
                    <View style={styles.priceInputRow}>
                      <View style={styles.currencyPrefix}>
                        <FontAwesome6 name="dollar" size={16} color="#7a7a7a" />
                      </View>
                      <TextInput
                        style={styles.priceInput}
                        value={weekdayRate}
                        onChangeText={(t) =>
                          handleFinalPriceChange(t, setWeekdayRate, setCustomerWeekdayPrice)
                        }
                        keyboardType="decimal-pad"
                        placeholder="e.g. 1000.00"
                        placeholderTextColor="#B0B0B0"
                      />
                    </View>
                  </View>

                  <View style={styles.priceColHalf}>
                    <Text style={styles.label}>Amount you'll get (Fri and Sat)</Text>
                    <View style={styles.priceInputRow}>
                      <View style={styles.currencyPrefix}>
                        <FontAwesome6 name="dollar" size={16} color="#7a7a7a" />
                      </View>
                      <TextInput
                        style={styles.priceInput}
                        value={weekendRate}
                        onChangeText={(t) =>
                          handleFinalPriceChange(t, setWeekendRate, setCustomerWeekendPrice)
                        }
                        keyboardType="decimal-pad"
                        placeholder="e.g. 2000.00"
                        placeholderTextColor="#B0B0B0"
                      />
                    </View>
                  </View>
                </View>
              </View>

              {/* Cancellation Policy */}
              <Text style={[styles.sectionTitle, { marginTop: 24 }]}>Cancellation Policy</Text>
              <View style={styles.cancelHeaderRow}>
                <View style={{ width: 22 }} />
                <Text style={[styles.cancelColumnLabel, { flex: 1 }]}>Days before check-in</Text>
                <Text style={[styles.cancelColumnLabel, { flex: 1 }]}>Refund Policy</Text>
              </View>

              {cancellationPolicy.map((row, index) => {
                const isError = cancelRowErrors[index];
                const isLast = index === cancellationPolicy.length - 1;
                return (
                  <View
                    key={index}
                    style={[
                      styles.cancelRow,
                      !isLast && { marginBottom: 12 },
                    ]}
                  >
                    <Text style={styles.cancelRowNumber}>{index + 1}.</Text>

                    <View style={[styles.cancelInputWrap, { marginRight: 8 }]}>
                      <TextInput
                        style={[styles.cancelInput, isError && styles.cancelInputError]}
                        value={row.before}
                        onChangeText={(t) => handleCancelDayChange(index, t)}
                        keyboardType="number-pad"
                        placeholder="Enter days"
                        placeholderTextColor="#B0B0B0"
                      />
                      <Text style={styles.cancelSuffix}>days</Text>
                    </View>

                    <View style={styles.cancelInputWrap}>
                      <TextInput
                        style={[styles.cancelInput, isError && styles.cancelInputError]}
                        value={row.refund}
                        onChangeText={(t) => handleCancelRefundChange(index, t)}
                        keyboardType="decimal-pad"
                        placeholder=""
                        placeholderTextColor="#B0B0B0"
                      />
                      <Text style={styles.cancelSuffix}>%</Text>
                    </View>
                  </View>
                );
              })}

              {hasCancellationError && (
                <Text style={styles.cancelErrorHint}>
                  Days must be 1–100. For more days before check-in, the refund % must be
                  equal to or higher than tiers with fewer days.
                </Text>
              )}

              {/* Facilities & Services */}
              <Text style={[styles.sectionTitle, { marginTop: 24 }]}>Facilities & Services</Text>
              <View style={styles.chipWrap}>
                {allFacilities.map((facility) => {
                  const isSelected = selectedFacilities.includes(facility);
                  return (
                    <TouchableOpacity
                      key={facility}
                      style={[styles.chip, isSelected && styles.chipSelected]}
                      onPress={() => toggleFacility(facility)}
                      activeOpacity={0.8}
                    >
                      <Text style={[styles.chipText, isSelected && styles.chipTextSelected]}>
                        {facility}
                      </Text>
                    </TouchableOpacity>
                  );
                })}

                {!showAddCategory && (
                  <TouchableOpacity
                    style={styles.addChip}
                    onPress={() => setShowAddCategory(true)}
                    activeOpacity={0.8}
                  >
                    <Text style={styles.addChipText}>+ Add Category</Text>
                  </TouchableOpacity>
                )}
              </View>

              {showAddCategory && (
                <View style={styles.addCategoryRow}>
                  <TextInput
                    style={[styles.input, { flex: 1, marginBottom: 0 }]}
                    value={newCategoryText}
                    onChangeText={setNewCategoryText}
                    placeholder="Enter facility name"
                    placeholderTextColor="#B0B0B0"
                    autoFocus
                    onSubmitEditing={handleAddCategory}
                  />
                  <TouchableOpacity style={styles.addCategoryConfirm} onPress={handleAddCategory}>
                    <Ionicons name="checkmark" size={20} color="#FFFFFF" />
                  </TouchableOpacity>
                </View>
              )}

              {/* Discount */}
              <Text style={[styles.label, { marginTop: 14 }]}>Discount (in %)</Text>
              <TextInput
                style={styles.input}
                value={discountPercent}
                onChangeText={(t) => handleDecimalChange(t, setDiscountPercent)}
                keyboardType="decimal-pad"
                placeholder=""
                placeholderTextColor="#999999"
              />

              <View style={styles.dateRow}>
                <View style={styles.dateCol}>
                  <Text style={styles.label}>Discount From Date</Text>
                  <TouchableOpacity style={styles.dateInput} onPress={() => setShowFromPicker(true)}>
                    <Text style={fromDate ? styles.dateText : styles.datePlaceholder}>
                      {fromDate ? formatDateDisplay(fromDate) : 'DD/MM/YYYY'}
                    </Text>
                    <Ionicons name="calendar-outline" size={18} color="#6B6B6B" />
                  </TouchableOpacity>
                </View>

                <View style={styles.dateCol}>
                  <Text style={styles.label}>Discount To Date</Text>
                  <TouchableOpacity style={styles.dateInput} onPress={() => setShowToPicker(true)}>
                    <Text style={toDate ? styles.dateText : styles.datePlaceholder}>
                      {toDate ? formatDateDisplay(toDate) : 'DD/MM/YYYY'}
                    </Text>
                    <Ionicons name="calendar-outline" size={18} color="#6B6B6B" />
                  </TouchableOpacity>
                </View>
              </View>

              {showFromPicker && (
                <DateTimePicker
                  value={fromDate || new Date()}
                  mode="date"
                  display={Platform.OS === 'ios' ? 'spinner' : 'default'}
                  minimumDate={new Date()}
                  onChange={onFromDateChange}
                />
              )}
              {showToPicker && (
                <DateTimePicker
                  value={toDate || fromDate || new Date()}
                  mode="date"
                  display={Platform.OS === 'ios' ? 'spinner' : 'default'}
                  minimumDate={fromDate || new Date()}
                  onChange={onToDateChange}
                />
              )}

              {/* Description */}
              <Text style={[styles.label, { marginTop: 24 }]}>Room Description</Text>
              <TextInput
                style={styles.textArea}
                value={description}
                onChangeText={setDescription}
                multiline
                numberOfLines={10}
                textAlignVertical="top"
                placeholder=""
                placeholderTextColor="#B0B0B0"
              />

              {/* Room Photos — unified gallery: existing (S3) + newly picked (local) */}
              <View style={styles.photosHeaderRow}>
                <Text style={styles.label}>Room Photos</Text>
                <Text style={styles.photoCount}>{totalPhotoCount}/{MAX_IMAGES}</Text>
              </View>

              <TouchableOpacity
                style={styles.uploadBox}
                onPress={handlePickImages}
                activeOpacity={0.8}
              >
                <Ionicons name="cloud-upload-outline" size={26} color="#D17B68" />
                <Text style={styles.uploadText}>Drag or Upload Images</Text>
                <Text style={styles.uploadHint}>Up to {MAX_IMAGES} photos · Max 3MB each</Text>
              </TouchableOpacity>

              {combinedPhotos.length > 0 && (
                <ScrollView
                  horizontal
                  showsHorizontalScrollIndicator={false}
                  style={styles.thumbScroll}
                  contentContainerStyle={{ paddingRight: 8 }}
                >
                  {combinedPhotos.map((item) => (
                    <View key={item.key} style={styles.thumbWrap}>
                      <Image source={{ uri: item.uri }} style={styles.thumbImage} />
                      <TouchableOpacity
                        style={styles.thumbRemove}
                        onPress={() => removePhoto(item)}
                      >
                        <Ionicons name="close" size={14} color="#000000" />
                      </TouchableOpacity>
                    </View>
                  ))}
                </ScrollView>
              )}

              <GradientButton
                title={isEditMode ? 'Update' : 'Create'}
                onPress={handleCreate}
                fontSize={20}
                disabled={submitting}
                loading={submitting}
              />
              <BorderButton
                title="Cancel"
                onPress={handleCancel}
                color="#303030"
                borderColor="#303030"
                fontSize={20}
                disabled={submitting}
              />
            </KeyboardAwareScrollView>
          )
        }
      </View>
      {admin === 2 ? <EmployerFooter /> : <Footer />}
      <DiscardChangesModal
        visible={showDiscardModal}
        onCancel={handleDiscardCancel}
        onConfirm={handleDiscardConfirm}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 15,
  },
  loadingWrap: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  scroll: {
    flex: 1,
  },
  scrollContent: {
    paddingTop: 15,
    paddingBottom: 100,
  },
  sectionTitle: {
    fontSize: 18,
    fontFamily: "Montserrat_600SemiBold",
    color: '#000000',
    lineHeight: 28,
    marginBottom: 10,
  },
  sectionTitleRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    marginTop: 24,
  },
  sectionSubtitle: {
    fontSize: 12,
    fontFamily: "Montserrat_500Medium",
    color: '#9A9A9A',
    marginLeft: 6,
  },
  label: {
    fontSize: 16,
    fontFamily: "Montserrat_500Medium",
    color: '#000000',
    lineHeight: 24,
    marginBottom: 6,
  },
  input: {
    borderWidth: 1,
    borderColor: '#c5c5c5',
    borderRadius: 5,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 14,
    color: '#000',
    backgroundColor: '#FFFFFF',
    marginBottom: 15,
  },
  priceGrid: {
    backgroundColor: '#ecedef',
    borderRadius: 5,
    padding: 14,
  },
  priceRowPair: {
    flexDirection: 'row',
    gap: 10,
  },
  priceColHalf: {
    flex: 1,
  },
  priceInputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#C5C5C5',
    borderRadius: 5,
    paddingHorizontal: 12,
  },
  currencyPrefix: {
    marginRight: 4,
  },
  priceInput: {
    flex: 1,
    paddingVertical: 12,
    fontSize: 13,
    lineHeight: 18,
    color: '#000',
    fontFamily: "Montserrat_400Regular",
  },
  cancelHeaderRow: {
    flexDirection: 'row',
    marginBottom: 10,
  },
  cancelColumnLabel: {
    fontSize: 13,
    fontFamily: "Montserrat_500Medium",
    color: '#4A4A4A',
  },
  cancelRow: {
    flexDirection: 'row',
    alignItems: 'center',
    // marginBottom: 12,
  },
  cancelRowNumber: {
    width: 22,
    fontSize: 14,
    fontFamily: "Montserrat_600SemiBold",
    color: '#000000',
  },
  cancelInputWrap: {
    flex: 1,
    position: 'relative',
    justifyContent: 'center',
  },
  cancelInput: {
    borderWidth: 1,
    borderColor: '#c5c5c5',
    borderRadius: 5,
    paddingLeft: 12,
    paddingRight: 44,
    paddingVertical: 11,
    fontSize: 13,
    color: '#000',
    fontFamily: "Montserrat_400Regular",
  },
  cancelInputError: {
    borderColor: '#E14C4C',
    backgroundColor: '#FDEDED',
  },
  cancelSuffix: {
    position: 'absolute',
    right: 12,
    fontSize: 12,
    color: '#9A9A9A',
    fontFamily: "Montserrat_400Regular",
  },
  cancelErrorHint: {
    fontSize: 12,
    color: '#E14C4C',
    fontFamily: "Montserrat_500Medium",
    marginTop: -4,
    marginBottom: 10,
  },
  chipWrap: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  chip: {
    borderWidth: 1,
    borderColor: '#000',
    borderRadius: 20,
    paddingHorizontal: 14,
    paddingVertical: 8,
    marginRight: 8,
    marginBottom: 10,
    backgroundColor: '#FFFFFF',
  },
  chipSelected: {
    backgroundColor: '#6C9BA1',
    borderColor: '#6C9BA1',
  },
  chipText: {
    fontSize: 13,
    lineHeight: 19,
    color: '#000000',
    fontFamily: "Montserrat_500Medium",
  },
  chipTextSelected: {
    color: '#FFFFFF',
    fontFamily: "Montserrat_600SemiBold",
  },
  addChip: {
    borderWidth: 1,
    borderColor: '#000',
    borderRadius: 20,
    paddingHorizontal: 14,
    paddingVertical: 8,
    marginBottom: 10,
    backgroundColor: '#FAFAFA',
  },
  addChipText: {
    fontSize: 13,
    lineHeight: 19,
    color: '#000000',
    fontFamily: "Montserrat_500Medium",
  },
  addCategoryRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  addCategoryConfirm: {
    marginLeft: 8,
    backgroundColor: '#4F8A8B',
    borderRadius: 10,
    width: 44,
    height: 44,
    justifyContent: 'center',
    alignItems: 'center',
  },
  dateRow: {
    flexDirection: 'row',
    gap: 12,
  },
  dateCol: {
    flex: 1,
  },
  dateInput: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 1,
    borderColor: '#c5c5c5',
    borderRadius: 5,
    paddingHorizontal: 14,
    paddingVertical: 12,
  },
  dateText: {
    fontSize: 13,
    lineHeight: 19,
    color: '#000000',
    fontFamily: "Montserrat_400Regular",
  },
  datePlaceholder: {
    fontSize: 13,
    lineHeight: 19,
    fontFamily: "Montserrat_400Regular",
    color: '#B0B0B0',
  },
  textArea: {
    borderWidth: 1,
    borderColor: '#c5c5c5',
    borderRadius: 5,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 14,
    lineHeight: 20,
    color: '#000000',
    fontFamily: "Montserrat_500Medium",
    minHeight: 110,
  },
  photosHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 24,
  },
  photoCount: {
    fontSize: 12,
    lineHeight: 18,
    fontFamily: "Montserrat_600SemiBold",
    color: '#9A9A9A',
  },
  uploadBox: {
    borderWidth: 1.5,
    borderColor: '#D17B68BF',
    borderStyle: 'dashed',
    borderRadius: 10,
    backgroundColor: '#D17B681A',
    paddingVertical: 26,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 10,
  },
  uploadText: {
    fontSize: 14,
    lineHeight: 18,
    fontFamily: "Montserrat_600SemiBold",
    color: '#D17B68',
    marginTop: 8,
  },
  uploadHint: {
    fontSize: 12,
    color: '#D17B68BF',
    marginTop: 4,
  },
  thumbScroll: {
    marginTop: 12,
  },
  thumbWrap: {
    width: 90,
    height: 90,
    borderRadius: 5,
    marginRight: 10,
    position: 'relative',
    borderWidth: 1,
    borderColor: '#c5c5c5',
  },
  thumbImage: {
    width: '100%',
    height: '100%',
    borderRadius: 5,
  },
  thumbRemove: {
    position: 'absolute',
    top: 0,
    right: 0,
    width: 15,
    height: 15,
    borderRadius: 10,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
  },
});