package com.example.mayarpg;

import android.os.Bundle;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;

import androidx.annotation.NonNull;
import androidx.annotation.Nullable;
import androidx.fragment.app.Fragment;

public class ExercisesFragment extends Fragment {

    @Nullable
    @Override
    public View onCreateView(@NonNull LayoutInflater inflater, @Nullable ViewGroup container, @Nullable Bundle savedInstanceState) {
        return inflater.inflate(R.layout.fragment_exercises, container, false);
    }

    @Override
    public void onViewCreated(@NonNull View view, @Nullable Bundle savedInstanceState) {
        super.onViewCreated(view, savedInstanceState);

        View.OnClickListener openDetail = v -> openExerciseDetail();

        view.findViewById(R.id.cardExercise1).setOnClickListener(openDetail);
        view.findViewById(R.id.btnIniciar1).setOnClickListener(openDetail);

        view.findViewById(R.id.cardExercise2).setOnClickListener(openDetail);
        view.findViewById(R.id.btnIniciar2).setOnClickListener(openDetail);

        view.findViewById(R.id.cardExercise3).setOnClickListener(openDetail);
        view.findViewById(R.id.btnIniciar3).setOnClickListener(openDetail);

        View.OnClickListener consume = v -> { };
        view.findViewById(R.id.btnPular1).setOnClickListener(consume);
        view.findViewById(R.id.btnPular2).setOnClickListener(consume);
        view.findViewById(R.id.btnPular3).setOnClickListener(consume);
    }

    private void openExerciseDetail() {
        getParentFragmentManager()
                .beginTransaction()
                .setReorderingAllowed(true)
                .replace(R.id.fragmentContainer, new ExerciseDetailFragment())
                .addToBackStack(null)
                .commit();
    }
}
