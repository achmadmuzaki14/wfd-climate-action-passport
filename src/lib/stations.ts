import type { StationConfig, StationSlug, ProgressMap } from './types';

export const STATION_ORDER: StationSlug[] = [
  'panel',
  'lets_read',
  'vr',
  'forest_product',
  'photo_story',
];

export const STATIONS: StationConfig[] = [
  {
    slug: 'panel',
    name: 'Join a Panel Session',
    subtitle: 'Mission 01',
    iconName: 'Presentation',
    color: 'emerald',
    approvalType: 'panel_code',
    description:
      'Attend the panel discussion at the exhibition. After the session, enter the panel code displayed by the speaker to mark this station complete.',
    instructions: [
      'Attend the panel discussion in the main hall',
      'Listen for the panel code announced at the end',
      'Enter the panel code below to complete this station',
    ],
  },
  {
    slug: 'lets_read',
    name: "Download Let's Read",
    subtitle: 'Mission 02',
    iconName: 'BookOpen',
    color: 'teal',
    approvalType: 'wfd_code',
    description:
      'Install and open the companion reading app on your device. Show your screen to the facilitator, who will enter the WFD approval code to confirm your participation.',
    instructions: [
      'Install the companion reading app from the provided link',
      'Open the app and explore the reading materials',
      'Show your screen to the facilitator',
      'The facilitator will enter the WFD approval code',
    ],
  },
  {
    slug: 'vr',
    name: 'Experience the Forest',
    subtitle: 'Mission 03',
    iconName: 'Glasses',
    color: 'cyan',
    approvalType: 'qr_scan',
    description:
      'Put on the VR headset and complete the immersive forest experience. After you finish, the facilitator will display a private QR code for you to scan and confirm completion.',
    instructions: [
      'Put on the VR headset at the VR station',
      'Complete the immersive forest experience',
      'Ask the facilitator to display the private QR code',
      'Scan the QR code to confirm completion',
    ],
  },
  {
    slug: 'forest_product',
    name: 'Discover a Forest Product',
    subtitle: 'Mission 04',
    iconName: 'TreePine',
    color: 'green',
    approvalType: 'wfd_code',
    description:
      'Explore the forest product exhibits and answer the reflection questions below. Submit your answers for facilitator review, then the facilitator will enter the WFD approval code.',
    instructions: [
      'Explore the forest product exhibits',
      'Answer all three reflection questions',
      'Submit your answers for review',
      'The facilitator will review and enter the WFD approval code',
    ],
    questions: [
      {
        id: 'q1',
        prompt: 'What forest product did you find most interesting, and why?',
        placeholder:
          'Describe the product that caught your attention and what made it stand out...',
      },
      {
        id: 'q2',
        prompt:
          'How do sustainable forest products contribute to local communities and economies?',
        placeholder:
          'Share your thoughts on the connection between sustainability and community...',
      },
      {
        id: 'q3',
        prompt:
          'Describe one thing you learned about the forest product lifecycle that surprised you.',
        placeholder: 'Share a surprising insight from the exhibit...',
      },
    ],
  },
  {
    slug: 'photo_story',
    name: 'Discover a Photo Story',
    subtitle: 'Mission 05',
    iconName: 'Camera',
    color: 'amber',
    approvalType: 'wfd_code',
    description:
      'Walk through the photo story exhibition and answer the reflection questions below. Submit your answers for facilitator review, then the facilitator will enter the WFD approval code.',
    instructions: [
      'Walk through the photo story exhibition',
      'Answer all three reflection questions',
      'Submit your answers for review',
      'The facilitator will review and enter the WFD approval code',
    ],
    questions: [
      {
        id: 'q1',
        prompt: 'What story does the photo series tell about the community and its land?',
        placeholder: 'Describe the narrative you saw in the images...',
      },
      {
        id: 'q2',
        prompt: 'Which photograph resonated most with you, and why?',
        placeholder: 'Reference a specific image and explain its impact on you...',
      },
      {
        id: 'q3',
        prompt:
          'How does visual storytelling help communicate environmental messages differently than text?',
        placeholder: 'Share your perspective on the power of visual storytelling...',
      },
    ],
  },
];

export function getStation(slug: string): StationConfig | undefined {
  return STATIONS.find((s) => s.slug === slug);
}

export function getStationIndex(slug: string): number {
  return STATION_ORDER.indexOf(slug as StationSlug);
}



export function getCompletedCount(progress: ProgressMap): number {
  return STATION_ORDER.filter(
    (slug) => progress[slug]?.status === 'approved'
  ).length;
}

// Re-export for convenience
export type { ProgressMap } from './types';

