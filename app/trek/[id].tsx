import { useLocalSearchParams, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import React, { useState } from 'react';
import { Image, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Colors } from '../../constants/Colors';

const placeholderImage = require('../../assets/images/pubert.jpg');

const TREK_DETAILS: Record<string, any> = {
  '1': {
    id: '1',
    name: 'Kedarkantha Trek',
    location: 'Uttarakhand, India',
    image: placeholderImage,
    rating: 4.8,
    duration: '5D/4N',
    durationDays: '4–5 Days',
    altitude: '12,500 ft',
    difficulty: 'Moderate',
    distance: '20 km',
    bestSeason: 'Dec – April',
    description: 'Kedarkantha is one of the most popular winter treks in India, known for its snow-covered trails and breathtaking summit views. The trek takes you through dense pine forests and offers stunning 360-degree views from the summit.',
    highlights: [
      'Snow trek in winter',
      '360° summit views',
      'Dense pine forests',
      'Beautiful campsites',
    ],
    guideRequired: true,
  },
  '2': {
    id: '2',
    name: 'Valley of Flowers Trek',
    location: 'Uttarakhand, India',
    image: placeholderImage,
    rating: 4.9,
    duration: '4D/3N',
    durationDays: '3–4 Days',
    altitude: '14,100 ft',
    difficulty: 'Easy',
    distance: '17 km',
    bestSeason: 'July – September',
    description: 'The Valley of Flowers is a breathtaking trek through meadows of endemic alpine flowers. Located in the Chamoli district, this UNESCO World Heritage Site offers a surreal experience with its vibrant floral diversity.',
    highlights: [
      'Rare alpine flowers',
      'UNESCO World Heritage Site',
      'Bhagirathi river views',
      'Exotic wildlife',
    ],
    guideRequired: false,
  },
  '3': {
    id: '3',
    name: 'Hampta Pass Trek',
    location: 'Himachal Pradesh, India',
    image: placeholderImage,
    rating: 4.7,
    duration: '5D/4N',
    durationDays: '4–5 Days',
    altitude: '14,100 ft',
    difficulty: 'Moderate',
    distance: '26 km',
    bestSeason: 'June – October',
    description: 'Hampta Pass is a thrilling trek that takes you from the lush green valleys of Kullu to the arid landscapes of Spiti. The contrast in landscapes makes this trek unique and memorable.',
    highlights: [
      'Cross-country trek',
      'Spectacular waterfalls',
      'Spiti Valley views',
      'Traditional villages',
    ],
    guideRequired: true,
  },
  '4': {
    id: '4',
    name: 'Triund Trek',
    location: 'Himachal Pradesh, India',
    image: placeholderImage,
    rating: 4.6,
    duration: '2D/1N',
    durationDays: '1–2 Days',
    altitude: '9,700 ft',
    difficulty: 'Easy',
    distance: '9 km',
    bestSeason: 'March – June',
    description: 'Triund is a perfect weekend trek near McLeodganj, offering stunning views of the Dhauladhar range. The trek is ideal for beginners and families looking for a quick mountain escape.',
    highlights: [
      'Perfect for beginners',
      'Dhauladhar range views',
      'Cafe culture at top',
      'Sunset and sunrise views',
    ],
    guideRequired: false,
  },
  '5': {
    id: '5',
    name: 'Roopkund Trek',
    location: 'Uttarakhand, India',
    image: placeholderImage,
    rating: 4.5,
    duration: '8D/7N',
    durationDays: '7–8 Days',
    altitude: '15,700 ft',
    difficulty: 'Difficult',
    distance: '53 km',
    bestSeason: 'May – June',
    description: 'Roopkund is a challenging high-altitude trek known for the mysterious skeletal lake at the summit. The trek takes you through remote villages, dense forests, and alpine meadows.',
    highlights: [
      'Mysterious skeletal lake',
      'High altitude challenge',
      'Ancient shrines',
      'Alpine meadows',
    ],
    guideRequired: true,
  },
};

export default function TrekDetailScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const [descriptionExpanded, setDescriptionExpanded] = useState(false);

  const trek = TREK_DETAILS[id as string] || TREK_DETAILS['1'];

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Easy':
        return '#22C55E';
      case 'Moderate':
        return '#F97316';
      case 'Difficult':
        return '#EF4444';
      default:
        return '#7C7C7C';
    }
  };

  return (
    <View style={styles.container}>
      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        bounces={false}
      >
        <View style={styles.heroSection}>
          <Image source={trek.image} style={styles.heroImage} />
          <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
            <Ionicons name="arrow-back" size={24} color="#FFFFFF" />
          </TouchableOpacity>
        </View>

        <View style={styles.contentSection}>
          <Text style={styles.trekName}>{trek.name}</Text>

          <View style={styles.locationRow}>
            <Ionicons name="location" size={16} color={Colors.textMuted} />
            <Text style={styles.locationText}>{trek.location}</Text>
          </View>

          <View style={styles.tagsRow}>
            <View style={styles.tag}>
              <Text style={[styles.tagText, { color: getDifficultyColor(trek.difficulty) }]}>
                {trek.difficulty}
              </Text>
            </View>
            <View style={styles.tag}>
              <Text style={styles.tagText}>{trek.durationDays}</Text>
            </View>
            <View style={styles.tag}>
              <Text style={styles.tagText}>{trek.altitude}</Text>
            </View>
          </View>

          <View style={styles.ratingRow}>
            <View style={styles.ratingItem}>
              <Ionicons name="star" size={18} color="#F59E0B" />
              <Text style={styles.ratingText}>{trek.rating} rating</Text>
            </View>
            <View style={styles.ratingItem}>
              <Ionicons name="time-outline" size={18} color={Colors.textMuted} />
              <Text style={styles.ratingText}>{trek.duration}</Text>
            </View>
            <View style={styles.ratingItem}>
              <Ionicons name="trending-up-outline" size={18} color={Colors.textMuted} />
              <Text style={styles.ratingText}>{trek.altitude}</Text>
            </View>
          </View>

          <View style={styles.infoCard}>
            <Text style={styles.sectionTitle}>Trek Details</Text>
            <View style={styles.infoGrid}>
              <View style={styles.infoItem}>
                <Text style={styles.infoLabel}>Difficulty</Text>
                <Text style={[styles.infoValue, { color: getDifficultyColor(trek.difficulty) }]}>
                  {trek.difficulty}
                </Text>
              </View>
              <View style={styles.infoItem}>
                <Text style={styles.infoLabel}>Duration</Text>
                <Text style={styles.infoValue}>{trek.durationDays}</Text>
              </View>
              <View style={styles.infoItem}>
                <Text style={styles.infoLabel}>Distance</Text>
                <Text style={styles.infoValue}>{trek.distance}</Text>
              </View>
              <View style={styles.infoItem}>
                <Text style={styles.infoLabel}>Altitude</Text>
                <Text style={styles.infoValue}>{trek.altitude}</Text>
              </View>
              <View style={[styles.infoItem, styles.infoItemFull]}>
                <Text style={styles.infoLabel}>Best Season</Text>
                <Text style={styles.infoValue}>{trek.bestSeason}</Text>
              </View>
            </View>
          </View>

          <View style={styles.descriptionSection}>
            <Text style={styles.sectionTitle}>About this Trek</Text>
            <Text style={styles.descriptionText} numberOfLines={descriptionExpanded ? undefined : 3}>
              {trek.description}
            </Text>
            <TouchableOpacity onPress={() => setDescriptionExpanded(!descriptionExpanded)}>
              <Text style={styles.seeMoreText}>
                {descriptionExpanded ? 'See Less' : 'See More'}
              </Text>
            </TouchableOpacity>
          </View>

          <View style={styles.highlightsSection}>
            <Text style={styles.sectionTitle}>Highlights</Text>
            {trek.highlights.map((highlight: string, index: number) => (
              <View key={index} style={styles.highlightItem}>
                <Ionicons name="checkmark-circle" size={20} color="#2E7D32" />
                <Text style={styles.highlightText}>{highlight}</Text>
              </View>
            ))}
          </View>

          {trek.guideRequired && (
            <View style={styles.alertCard}>
              <Ionicons name="warning" size={22} color="#EF4444" />
              <Text style={styles.alertText}>Guide is mandatory for this trek</Text>
            </View>
          )}

          <View style={styles.bottomSpacer} />
        </View>
      </ScrollView>

      <View style={styles.bottomBar}>
        {trek.guideRequired && (
          <Text style={styles.guideNote}>Guide required for this trek</Text>
        )}
        <TouchableOpacity style={styles.bookButton}>
          <Text style={styles.bookButtonText}>Book a Guide</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  scrollView: {
    flex: 1,
  },
  heroSection: {
    position: 'relative',
    height: 280,
  },
  heroImage: {
    width: '100%',
    height: '100%',
  },
  backButton: {
    position: 'absolute',
    top: 50,
    left: 16,
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
    padding: 10,
    borderRadius: 24,
  },
  contentSection: {
    padding: 20,
  },
  trekName: {
    fontSize: 26,
    fontWeight: '700',
    color: Colors.text,
    marginBottom: 8,
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  locationText: {
    fontSize: 15,
    color: Colors.textMuted,
    marginLeft: 6,
  },
  tagsRow: {
    flexDirection: 'row',
    marginBottom: 20,
  },
  tag: {
    backgroundColor: Colors.surface,
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 20,
    marginRight: 10,
  },
  tagText: {
    fontSize: 13,
    color: Colors.text,
    fontWeight: '500',
  },
  ratingRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 16,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: Colors.border,
    marginBottom: 24,
  },
  ratingItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  ratingText: {
    fontSize: 14,
    color: Colors.text,
    marginLeft: 6,
    fontWeight: '500',
  },
  infoCard: {
    backgroundColor: Colors.background,
    borderRadius: 16,
    padding: 20,
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 3,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: Colors.text,
    marginBottom: 16,
  },
  infoGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  infoItem: {
    width: '50%',
    marginBottom: 16,
  },
  infoItemFull: {
    width: '100%',
  },
  infoLabel: {
    fontSize: 13,
    color: Colors.textMuted,
    marginBottom: 4,
  },
  infoValue: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.text,
  },
  descriptionSection: {
    marginBottom: 24,
  },
  descriptionText: {
    fontSize: 15,
    color: Colors.text,
    lineHeight: 24,
  },
  seeMoreText: {
    fontSize: 15,
    color: '#2E7D32',
    fontWeight: '600',
    marginTop: 8,
  },
  highlightsSection: {
    marginBottom: 24,
  },
  highlightItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  highlightText: {
    fontSize: 15,
    color: Colors.text,
    marginLeft: 12,
    flex: 1,
  },
  alertCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FEF2F2',
    borderWidth: 1,
    borderColor: '#EF4444',
    borderRadius: 12,
    padding: 16,
    marginBottom: 24,
  },
  alertText: {
    fontSize: 15,
    color: '#EF4444',
    fontWeight: '600',
    marginLeft: 12,
  },
  bottomSpacer: {
    height: 100,
  },
  bottomBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: Colors.background,
    padding: 20,
    paddingBottom: 34,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
  },
  guideNote: {
    fontSize: 13,
    color: Colors.textMuted,
    textAlign: 'center',
    marginBottom: 10,
  },
  bookButton: {
    backgroundColor: '#2E7D32',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    shadowColor: '#2E7D32',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  bookButtonText: {
    color: '#FFFFFF',
    fontSize: 17,
    fontWeight: '600',
  },
});
