import { useCallback, useEffect, useState } from 'react';
import { ApiError, medicinesApi } from './api';
import { MedicineForm } from './MedicineForm';
import type { Medicine, MedicineInput } from './types';
import './styles.css';

type Notice = { kind: 'success' | 'error'; text: string } | null;

export default function App() {
  const [medicines, setMedicines] = useState<Medicine[]>([]);
  const [editing, setEditing] = useState<Medicine | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [notice, setNotice] = useState<Notice>(null);

  const showError = (error: unknown) => {
    const detail = error instanceof ApiError ? ` (${error.status})` : '';
    setNotice({ kind: 'error', text: `${error instanceof Error ? error.message : 'Error inesperado'}${detail}` });
  };

  const load = useCallback(async () => {
    setLoading(true);
    try {
      setMedicines(await medicinesApi.list());
    } catch (error) {
      showError(error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { void load(); }, [load]);

  const save = async (input: MedicineInput) => {
    setSaving(true);
    setNotice(null);
    try {
      if (editing) {
        const confirmed = await medicinesApi.update(editing.id, input);
        setMedicines((current) => current.map((item) => item.id === confirmed.id ? confirmed : item));
        setEditing(null);
        setNotice({ kind: 'success', text: 'Medicamento actualizado por la API.' });
      } else {
        const confirmed = await medicinesApi.create(input);
        setMedicines((current) => [...current, confirmed]);
        setNotice({ kind: 'success', text: 'Medicamento creado por la API.' });
      }
      return true;
    } catch (error) {
      showError(error);
      return false;
    } finally {
      setSaving(false);
    }
  };

  const remove = async (medicine: Medicine) => {
    if (!window.confirm(`¿Eliminar ${medicine.name}?`)) return;
    setDeletingId(medicine.id);
    setNotice(null);
    try {
      await medicinesApi.remove(medicine.id);
      setMedicines((current) => current.filter((item) => item.id !== medicine.id));
      if (editing?.id === medicine.id) setEditing(null);
      setNotice({ kind: 'success', text: 'Medicamento eliminado (204).' });
    } catch (error) {
      showError(error);
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <main>
      <header className="hero">
        <div className="brand-mark">M+</div>
        <div>
          <span className="eyebrow">Inventario clínico</span>
          <h1>MedStock</h1>
          <p>Catálogo validado y sincronizado con la API.</p>
        </div>
        <a className="docs-link" href="http://localhost:3000/docs" target="_blank">OpenAPI ↗</a>
      </header>

      {notice && <div role="status" className={`notice ${notice.kind}`}>{notice.text}<button aria-label="Cerrar" onClick={() => setNotice(null)}>×</button></div>}

      <section className="layout">
        <MedicineForm editing={editing} busy={saving} onCancel={() => setEditing(null)} onSubmit={save} />
        <div className="collection">
          <div className="collection-heading">
            <div><span className="eyebrow">Colección</span><h2>Medicamentos <span>{medicines.length}</span></h2></div>
            <button className="refresh" onClick={() => void load()} disabled={loading}>↻ Actualizar</button>
          </div>
          {loading ? <div className="state-card">Consultando la API…</div> : medicines.length === 0 ? <div className="state-card"><strong>Inventario vacío</strong><span>Crea el primer medicamento desde el formulario.</span></div> : (
            <div className="table-wrap"><table><thead><tr><th>Medicamento</th><th>Precio</th><th>Stock</th><th>Receta</th><th aria-label="Acciones" /></tr></thead><tbody>
              {medicines.map((medicine) => <tr key={medicine.id}><td><strong>{medicine.name}</strong><small>{medicine.sku}</small></td><td>Q {medicine.price.toFixed(2)}</td><td><span className={medicine.stock < 10 ? 'stock low' : 'stock'}>{medicine.stock}</span></td><td>{medicine.requiresPrescription ? 'Sí' : 'No'}</td><td className="actions"><button onClick={() => setEditing(medicine)}>Editar</button><button className="danger" disabled={deletingId === medicine.id} onClick={() => void remove(medicine)}>{deletingId === medicine.id ? '…' : 'Eliminar'}</button></td></tr>)}
            </tbody></table></div>
          )}
        </div>
      </section>
    </main>
  );
}

