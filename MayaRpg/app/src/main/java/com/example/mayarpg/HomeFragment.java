package com.example.mayarpg;

import android.app.AlertDialog;
import android.content.Intent;
import android.os.Bundle;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.Button;
import android.widget.TextView;

import androidx.annotation.NonNull;
import androidx.annotation.Nullable;
import androidx.fragment.app.Fragment;

public class HomeFragment extends Fragment {

    private static final String KEY_NOME = "key_nome";

    public static HomeFragment newInstance(String nomeUsuario) {
        HomeFragment fragment = new HomeFragment();
        Bundle args = new Bundle();
        args.putString(KEY_NOME, nomeUsuario == null ? "Paciente" : nomeUsuario);
        fragment.setArguments(args);
        return fragment;
    }

    @Nullable
    @Override
    public View onCreateView(@NonNull LayoutInflater inflater, @Nullable ViewGroup container, @Nullable Bundle savedInstanceState) {
        return inflater.inflate(R.layout.fragment_home, container, false);
    }

    @Override
    public void onViewCreated(@NonNull View view, @Nullable Bundle savedInstanceState) {
        super.onViewCreated(view, savedInstanceState);

        TextView tvBoasVindas = view.findViewById(R.id.tvBoasVindas);
        Button btnLogout = view.findViewById(R.id.btnLogout);

        String nome = "Paciente";
        if (getArguments() != null) {
            nome = getArguments().getString(KEY_NOME, "Paciente");
        }
        tvBoasVindas.setText(getString(R.string.bem_vindo, nome));

        btnLogout.setOnClickListener(v -> showLogoutDialog());
    }

    // Dialog de confirmacao para evitar logout acidental.
    private void showLogoutDialog() {
        if (getContext() == null) return;

        new AlertDialog.Builder(getContext())
                .setMessage(getString(R.string.logout_msg))
                .setNegativeButton(getString(R.string.cancelar), (dialog, which) -> dialog.dismiss())
                .setPositiveButton(getString(R.string.sair_da_conta), (dialog, which) -> {
                    Intent intent = new Intent(requireContext(), MainActivity.class);
                    intent.addFlags(Intent.FLAG_ACTIVITY_CLEAR_TOP | Intent.FLAG_ACTIVITY_NEW_TASK);
                    startActivity(intent);
                    requireActivity().finish();
                })
                .show();
    }
}
