import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { Image, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Colors } from '../../constants/Colors';

const placeholderImage = require('../../assets/images/pubert.jpg');

const SAVED_TREKS = [
  {
    id: '1',
    name: 'Kedarkantha Trek',
    location: 'Uttarakhand, India',
    image: placeholderImage,
    rating: 4.8,
    duration: '5D/4N',
    altitude: '12,500 ft',
    difficulty: 'Moderate',
  },
];

export default function SavedScreen() {
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
      <View style={styles.header}>
        <Text style={styles.title}>Saved Treks</Text>
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {SAVED_TREKS.map((trek) => (
          <View key={trek.id} style={styles.trekCard}>
            <View style={styles.imageContainer}>
              <Image source={trek.image} style={styles.trekImage} />
              <View style={styles.difficultyBadge}>
                <Text style={[styles.difficultyText, { color: getDifficultyColor(trek.difficulty) }]}>
                  {trek.difficulty}
                </Text>
              </View>
              <TouchableOpacity style={styles.bookmarkButton}>
                <Ionicons name="bookmark" size={22} color="#2E7D32" />
              </TouchableOpacity>
            </View>

            <View style={styles.trekInfo}>
              <View style={styles.trekMeta}>
                <View style={styles.ratingContainer}>
                  <Ionicons name="star" size={16} color="#F59E0B" />
                  <Text style={styles.ratingText}>{trek.rating}</Text>
                </View>
                <View style={styles.metaItem}>
                  <Text style={styles.metaText}>{trek.duration}</Text>
                </View>
                <View style={styles.metaItem}>
                  <Text style={styles.metaText}>{trek.altitude}</Text>
                </View>
              </View>

              <Text style={styles.trekName}>{trek.name}</Text>

              <View style={styles.locationContainer}>
                <Ionicons name="location" size={14} color={Colors.textMuted} />
                <Text style={styles.locationText}>{trek.location}</Text>
              </View>
            </View>
          </View>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  header: {
    paddingTop: 60,
    paddingHorizontal: 20,
    paddingBottom: 20,
    backgroundColor: Colors.background,
  },
  title: {
    fontSize: 26,
    fontWeight: '700',
    color: Colors.text,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingBottom: 100,
  },
  trekCard: {
    backgroundColor: Colors.background,
    borderRadius: 16,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 3,
    overflow: 'hidden',
  },
  imageContainer: {
    position: 'relative',
    height: 200,
  },
  trekImage: {
    width: '100%',
    height: '100%',
  },
  difficultyBadge: {
    position: 'absolute',
    top: 12,
    left: 12,
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  difficultyText: {
    fontSize: 12,
    fontWeight: '600',
  },
  bookmarkButton: {
    position: 'absolute',
    top: 12,
    right: 12,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    padding: 10,
    borderRadius: 24,
  },
  trekInfo: {
    padding: 16,
  },
  trekMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 16,
  },
  ratingText: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.text,
    marginLeft: 4,
  },
  metaItem: {
    backgroundColor: Colors.surface,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    marginRight: 8,
  },
  metaText: {
    fontSize: 12,
    color: Colors.textMuted,
    fontWeight: '500',
  },
  trekName: {
    fontSize: 18,
    fontWeight: '700',
    color: Colors.text,
    marginBottom: 6,
  },
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  locationText: {
    fontSize: 14,
    color: Colors.textMuted,
    marginLeft: 4,
  },
});
