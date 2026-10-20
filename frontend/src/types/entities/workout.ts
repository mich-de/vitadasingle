// src/types/entities/workout.ts

export interface Workout {
  id: string;
  userId: string;
  name: string;
  type: WorkoutType;
  duration: number; // in minutes
  intensity: WorkoutIntensity;
  calories?: number;
  exercises: string[];
  notes?: string;
  date: string;
  createdAt: string;
  updatedAt: string;
}

export type WorkoutType = 'strength' | 'cardio' | 'flexibility' | 'sports';
export type WorkoutIntensity = 'low' | 'moderate' | 'high' | 'extreme';

export interface CreateWorkoutInput {
  name: string;
  type: WorkoutType;
  duration: number;
  intensity: WorkoutIntensity;
  calories?: number;
  exercises: string[];
  notes?: string;
  date: string;
}

export interface UpdateWorkoutInput {
  name?: string;
  type?: WorkoutType;
  duration?: number;
  intensity?: WorkoutIntensity;
  calories?: number;
  exercises?: string[];
  notes?: string;
  date?: string;
}

export interface WorkoutFilters {
  type?: WorkoutType;
  intensity?: WorkoutIntensity;
  dateRange?: {
    start: string;
    end: string;
  };
  minDuration?: number;
  maxDuration?: number;
  minCalories?: number;
  maxCalories?: number;
}

export interface Exercise {
  id: string;
  name: string;
  category: ExerciseCategory;
  muscleGroups: string[];
  equipment?: string[];
  instructions?: string;
}

export type ExerciseCategory = 'strength' | 'cardio' | 'flexibility' | 'plyometric' | 'balance';

export interface WorkoutSet {
  exerciseId: string;
  reps?: number;
  weight?: number;
  duration?: number; // for time-based exercises
  distance?: number; // for cardio
  restTime?: number; // seconds
}

export interface WorkoutPlan {
  id: string;
  name: string;
  description?: string;
  workouts: Workout[];
  duration: number; // weeks
  difficulty: WorkoutIntensity;
}

export interface WorkoutStats {
  totalWorkouts: number;
  totalDuration: number; // minutes
  totalCalories: number;
  averageIntensity: WorkoutIntensity;
  favoriteType: WorkoutType;
  streak: number; // days
}
