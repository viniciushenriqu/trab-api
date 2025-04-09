import React, { useState, useEffect } from 'react';
import './Sales.css';

const Sales = () => {
  const [sales, setSales] = useState([]);
  const [formData, setFormData] = useState({ product: '', quantity: '', total: '' });
  const [editingIndex, setEditingIndex] = useState(null);

  useEffect(() => {
    fetch("https://localhost:5001/api/sales")
      .then((res) => res.json())
      .then((data) => setSales(data))
      .catch((err) => console.error("Erro ao buscar vendas:", err));
  }, []);
  
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const method = editingIndex !== null ? "PUT" : "POST";
    const url =
      method === "POST"
        ? "https://localhost:5001/api/sales"
        : `https://localhost:5001/api/sales/${sales[editingIndex].id}`;
  
    const response = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(
        method === "POST"
          ? formData
          : { ...formData, id: sales[editingIndex].id }
      ),
    });
  
    if (response.ok) {
      const updated = await fetch("https://localhost:5001/api/sales").then((res) =>
        res.json()
      );
      setSales(updated);
      setEditingIndex(null);
      setFormData({ product: "", quantity: "", total: "" });
    } else {
      alert("Erro ao salvar venda");
    }
  };
  

  const handleEdit = (index) => {
    setFormData(sales[index]);
    setEditingIndex(index);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Deseja realmente excluir?")) return;
  
    const response = await fetch(`https://localhost:5001/api/sales/${id}`, {
      method: "DELETE",
    });
  
    if (response.ok) {
      setSales(sales.filter((sale) => sale.id !== id));
    } else {
      alert("Erro ao excluir venda");
    }
  };
  

  const handleView = (sale) => {
    alert(`Produto: ${sale.product}\nQuantidade: ${sale.quantity}\nTotal: R$ ${sale.total}`);
  };

  return (
    <div className="sales-page">
      <div className="header-bar">Sistema de Vendas</div>
      <div className="sales-content">
        <div className="sales-container">
          <h2>Vendas</h2>
          <form onSubmit={handleSubmit} className="sale-form">
            <input
              type="text"
              name="product"
              placeholder="Produto"
              value={formData.product}
              onChange={handleChange}
              required
            />
            <input
              type="number"
              name="quantity"
              placeholder="Quantidade"
              value={formData.quantity}
              onChange={handleChange}
              required
            />
            <input
              type="number"
              name="total"
              placeholder="Total (R$)"
              value={formData.total}
              onChange={handleChange}
              required
            />
            <button type="submit">{editingIndex !== null ? 'Atualizar' : 'Adicionar'}</button>
          </form>

          <table className="sales-table">
            <thead>
              <tr>
                <th>Produto</th>
                <th>Quantidade</th>
                <th>Total (R$)</th>
                <th>Ações</th>
              </tr>
            </thead>
            <tbody>
              {sales.map((sale, index) => (
                <tr key={sale.id}>
                  <td>{sale.product}</td>
                  <td>{sale.quantity}</td>
                  <td>{sale.total}</td>
                  <td>
                    <button onClick={() => handleView(sale)}>👁️</button>
                    <button onClick={() => handleEdit(index)}>✏️</button>
                    <button onClick={() => handleDelete(sale.id)}>🗑️</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Sales;
