import { Ionicons } from '@expo/vector-icons';
import { View } from 'react-native';
import Svg, { Circle } from 'react-native-svg';

interface Props {
    size: number;
    progress: number;
    isDownloading: boolean;
    isDownloaded: boolean;
    color: string;
    trackColor: string;
}

const STROKE_WIDTH = 1.5;

// Same download-circle convention as most subscription music apps: an empty
// ring, a ring that fills clockwise while `isDownloading`, then a filled
// checkmark once `isDownloaded`.
export default function DownloadRing({ size, progress, isDownloading, isDownloaded, color, trackColor }: Props) {
    const radius = (size - STROKE_WIDTH) / 2;
    const circumference = 2 * Math.PI * radius;

    return (
        <View style={{ width: size, height: size, alignItems: 'center', justifyContent: 'center' }}>
            <Svg width={size} height={size} style={{ position: 'absolute', transform: [{ rotate: '-90deg' }] }}>
                <Circle cx={size / 2} cy={size / 2} r={radius} stroke={isDownloaded ? color : trackColor} strokeWidth={STROKE_WIDTH} fill="none" />
                {isDownloading && (
                    <Circle
                        cx={size / 2}
                        cy={size / 2}
                        r={radius}
                        stroke={color}
                        strokeWidth={STROKE_WIDTH}
                        fill="none"
                        strokeLinecap="round"
                        strokeDasharray={circumference}
                        strokeDashoffset={circumference * (1 - progress)}
                    />
                )}
            </Svg>
            <Ionicons name={isDownloaded ? 'checkmark' : 'arrow-down'} size={size * 0.55} color={isDownloaded ? color : trackColor} />
        </View>
    );
}
