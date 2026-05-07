package com.example.mayarpg;

import android.app.AlertDialog;
import android.content.Intent;
import android.os.Bundle;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.Button;
import android.widget.EditText;
import android.widget.ImageButton;
import android.widget.RatingBar;
import android.widget.TextView;
import android.widget.Toast;

import androidx.annotation.NonNull;
import androidx.annotation.Nullable;
import androidx.fragment.app.Fragment;

import com.google.firebase.auth.FirebaseAuth;
import com.google.firebase.firestore.DocumentSnapshot;

public class HomeFragment extends Fragment {

    private static final String KEY_NOME = "key_nome";

    private final FirestoreConsultasRepository consultasRepository = new FirestoreConsultasRepository();
    private String ultimaConsultaId;

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
        ImageButton btnLogoutTop = view.findViewById(R.id.btnLogoutTop);

        String nome = "Paciente";
        if (getArguments() != null) {
            nome = getArguments().getString(KEY_NOME, "Paciente");
        }
        tvBoasVindas.setText(getString(R.string.bem_vindo, nome));

        btnLogoutTop.setOnClickListener(v -> showLogoutDialog());

        TextView tvProximaSessao = view.findViewById(R.id.tvProximaSessaoData);
        TextView tvResponder = view.findViewById(R.id.tvResponderFeedback);

        carregarUltimaConsultaNaUi(tvProximaSessao);

        tvResponder.setOnClickListener(v -> {
            if (ultimaConsultaId == null) {
                Toast.makeText(requireContext(), R.string.feedback_sem_consulta, Toast.LENGTH_SHORT).show();
                return;
            }
            mostrarDialogFeedback(ultimaConsultaId);
        });
    }

    private void carregarUltimaConsultaNaUi(TextView tvProximaSessao) {
        consultasRepository.buscarUltimaConsulta().addOnCompleteListener(task -> {
            if (!isAdded() || tvProximaSessao == null) {
                return;
            }
            if (!task.isSuccessful()) {
                tvProximaSessao.setText(R.string.erro_carregar_sessao);
                ultimaConsultaId = null;
                return;
            }
            DocumentSnapshot doc = FirestoreConsultasRepository.primeiraConsultaOuNull(task.getResult());
            if (doc == null) {
                tvProximaSessao.setText(R.string.nenhuma_consulta_agendada);
                ultimaConsultaId = null;
                return;
            }
            ultimaConsultaId = doc.getId();
            String dataIso = doc.getString("dataIso");
            String horario = doc.getString("horario");
            tvProximaSessao.setText(ConsultaFormatacao.rotuloSessaoPt(dataIso, horario));
        });
    }

    private void mostrarDialogFeedback(String consultaId) {
        if (getContext() == null) {
            return;
        }

        View dialogView = LayoutInflater.from(getContext()).inflate(R.layout.dialog_feedback, null);
        AlertDialog dialog = new AlertDialog.Builder(getContext())
                .setView(dialogView)
                .create();

        RatingBar ratingBar = dialogView.findViewById(R.id.ratingFeedback);
        EditText etComentario = dialogView.findViewById(R.id.etFeedbackComentario);
        Button btnCancelar = dialogView.findViewById(R.id.btnFeedbackCancelar);
        Button btnEnviar = dialogView.findViewById(R.id.btnFeedbackEnviar);

        btnCancelar.setOnClickListener(v -> dialog.dismiss());

        btnEnviar.setOnClickListener(v -> {
            int nota = (int) ratingBar.getRating();
            if (nota < 1 || nota > 5) {
                Toast.makeText(requireContext(), R.string.feedback_escolha_nota, Toast.LENGTH_SHORT).show();
                return;
            }
            String texto = etComentario.getText() != null ? etComentario.getText().toString() : "";

            btnEnviar.setEnabled(false);
            consultasRepository.salvarFeedback(consultaId, nota, texto)
                    .addOnCompleteListener(taskSalvar -> {
                        if (!isAdded()) {
                            return;
                        }
                        btnEnviar.setEnabled(true);
                        if (taskSalvar.isSuccessful()) {
                            Toast.makeText(requireContext(), R.string.feedback_enviado, Toast.LENGTH_SHORT).show();
                            dialog.dismiss();
                        } else {
                            Toast.makeText(requireContext(), R.string.feedback_erro, Toast.LENGTH_LONG).show();
                        }
                    });
        });

        dialog.show();
    }

    // Dialog de confirmacao para evitar logout acidental.
    private void showLogoutDialog() {
        if (getContext() == null) return;

        View dialogView = LayoutInflater.from(getContext()).inflate(R.layout.dialog_logout, null);
        AlertDialog dialog = new AlertDialog.Builder(getContext())
                .setView(dialogView)
                .create();

        Button btnCancelar = dialogView.findViewById(R.id.btnCancelarLogout);
        Button btnConfirmar = dialogView.findViewById(R.id.btnConfirmarLogout);

        btnCancelar.setOnClickListener(v -> dialog.dismiss());
        btnConfirmar.setOnClickListener(v -> {
            FirebaseAuth.getInstance().signOut();

            Intent intent = new Intent(requireContext(), MainActivity.class);
            intent.addFlags(Intent.FLAG_ACTIVITY_NEW_TASK | Intent.FLAG_ACTIVITY_CLEAR_TASK);
            startActivity(intent);
            requireActivity().finish();
            dialog.dismiss();
        });

        dialog.show();
    }
}
