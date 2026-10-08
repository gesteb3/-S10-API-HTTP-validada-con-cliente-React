import { useEffect, useState, type FormEvent } from 'react';
import type { Medicine, MedicineInput } from './types';

const emptyForm: MedicineInput = {
  name: '',
  sku: '',
  price: 0,
  stock: 0,
  requiresPrescription: false,
};

interface Props {
  editing: Medicine | null;
  busy: boolean;
  onCancel: () => void;
  onSubmit: (input: MedicineInput) => Promise<boolean>;
}

export function MedicineForm({ editing, busy, onCancel, onSubmit }: Props) {
  const [form, setForm] = useState<MedicineInput>(emptyForm);

  useEffect(() => {
    setForm(
      editing
        ? {
            name: editing.name,
            sku: editing.sku,
            price: editing.price,
            stock: editing.stock,
            requiresPrescription: editing.requiresPrescription,
          }
        : emptyForm,
    );
  }, [editing]);

  const submit = async (event: FormEvent) => {
    event.preventDefault();
    const succeeded = await onSubmit(form);
    if (succeeded && !editing) setForm(emptyForm);
  };

  return (
    <form className="medicine-form" onSubmit={submit}>
      <div className="form-heading">
        <div>
          <span className="eyebrow">{editing ? 'Edición' : 'Nuevo registro'}</span>
          <h2>{editing ? 'Actualizar medicamento' : 'Agregar medicamento'}</h2>
        </div>
        {editing && <button type="button" className="text-button" onClick={onCancel}>Cancelar</button>}
      </div>
      <label>Nombre<input required minLength={2} maxLength={80} value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="Paracetamol 500 mg" /></label>
      <label>SKU<input required minLength={3} maxLength={20} value={form.sku} onChange={(e) => setForm({ ...form, sku: e.target.value.toUpperCase() })} placeholder="PAR-500" /></label>
      <div className="field-row">
        <label>Precio<input required type="number" min="0.01" max="100000" step="0.01" value={form.price || ''} onChange={(e) => setForm({ ...form, price: Number(e.target.value) })} /></label>
        <label>Existencias<input required type="number" min="0" max="100000" step="1" value={form.stock} onChange={(e) => setForm({ ...form, stock: Number(e.target.value) })} /></label>
      </div>
      <label className="checkbox"><input type="checkbox" checked={form.requiresPrescription} onChange={(e) => setForm({ ...form, requiresPrescription: e.target.checked })} />Requiere receta</label>
      <button className="primary-button" disabled={busy}>{busy ? 'Guardando…' : editing ? 'Guardar cambios' : 'Crear medicamento'}</button>
    </form>
  );
}

