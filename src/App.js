
import React, { useState, useEffect } from 'react';
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import axios from 'axios';
import { Modal, ModalBody, ModalFooter, ModalHeader } from 'reactstrap';

function App() {
  const baseUrl = "https://localhost:7280/api/Vendas";
  const [data, setData] = useState([]);

  const [modalEditar, setModalEditar] = useState(false);
  const [modalExcluir, setModalExcluir] = useState(false);

  const [vendaSelecionada, setVendaSelecionada] = useState({
    id: '',
    produto: '',
    quantidade: '',
    valor: ''
  });

  const [novaVenda, setNovaVenda] = useState({
    produto: '',
    quantidade: '',
    valor: ''
  });

  const handleChangeNovaVenda = e => {
    const { name, value } = e.target;
    setNovaVenda({
      ...novaVenda,
      [name]: value
    });
  };

  const handleChange = e => {
    const { name, value } = e.target;
    setVendaSelecionada({
      ...vendaSelecionada,
      [name]: value
    });
  };

  const abrirFecharModalEditar = () => setModalEditar(!modalEditar);
  const abrirFecharModalExcluir = () => setModalExcluir(!modalExcluir);

  const vendasGet = async () => {
    await axios.get(baseUrl)
      .then(response => setData(response.data))
      .catch(error => console.log(error));
  };

  const vendasPost = async () => {
    const nova = {
      ...novaVenda,
      quantidade: parseInt(novaVenda.quantidade),
      valor: parseFloat(novaVenda.valor)
    };
    await axios.post(baseUrl, nova)
      .then(response => {
        setData(data.concat(response.data));
        setNovaVenda({ produto: '', quantidade: '', valor: '' }); 
      }).catch(error => console.log(error));
  };

  const vendasPut = async () => {
    const atualizada = {
      ...vendaSelecionada,
      quantidade: parseInt(vendaSelecionada.quantidade),
      valor: parseFloat(vendaSelecionada.valor)
    };
  
    await axios
      .put(`${baseUrl}/${vendaSelecionada.id}`, atualizada)
      .then(() => {
        const dadosAtualizados = data.map((venda) => {
          if (venda.id === vendaSelecionada.id) {
            return {
              ...venda,
              produto: atualizada.produto,
              quantidade: atualizada.quantidade,
              valor: atualizada.valor
            };
          }
          return venda;
        });
        setData(dadosAtualizados);
        abrirFecharModalEditar();
      })
      .catch((error) => {
        console.log(error);
      });
  };
  

  const vendasDelete = async () => {
    await axios.delete(`${baseUrl}/${vendaSelecionada.id}`)
      .then(() => {
        setData(data.filter(venda => venda.id !== vendaSelecionada.id));
        abrirFecharModalExcluir();
      }).catch(error => console.log(error));
  };

  const selecionarVenda = (venda, caso) => {
    setVendaSelecionada(venda);
    if (caso === "Excluir") {
      abrirFecharModalExcluir();
    } else if (caso === "Editar") {
      abrirFecharModalEditar();
    }
  };

  useEffect(() => {
    vendasGet();
  }, []);

  return (
    <div className="app-wrapper">
      <div className="venda-container">
        <header>Sistema de Vendas</header>
        <form className="form-inline">
          <h4>Vendas</h4>
          <div className="form-group">
            <input
              type="text"
              name="produto"
              className="form-control"
              placeholder="Produto"
              onChange={handleChangeNovaVenda}
              value={novaVenda.produto}
            />
            <input
              type="number"
              name="quantidade"
              className="form-control"
              placeholder="Quantidade"
              onChange={handleChangeNovaVenda}
              value={novaVenda.quantidade}
            />
            <input
              type="number"
              step="0.01"
              name="valor"
              className="form-control"
              placeholder="Valor (R$)"
              onChange={handleChangeNovaVenda}
              value={novaVenda.valor}
            />
            <button
              type="button"
              className="btn btn-success"
              onClick={vendasPost}
            >
              Adicionar
            </button>
          </div>
        </form>
        <table className="table table-bordered mt-4">
          <thead>
            <tr>
              <th>Produto</th>
              <th>Quantidade</th>
              <th>Valor (R$)</th>
              <th>Ações</th>
            </tr>
          </thead>
          <tbody>
            {data.map(venda => (
              <tr key={venda.id}>
                <td>{venda.produto}</td>
                <td>{venda.quantidade}</td>
                <td>{venda.valor?.toFixed(2) || '0.00'}</td>
                <td>
                  <button
                    className="btn btn-primary"
                    onClick={() => selecionarVenda(venda, "Editar")}
                  >
                    Editar
                  </button>{" "}
                  <button
                    className="btn btn-danger"
                    onClick={() => selecionarVenda(venda, "Excluir")}
                  >
                    Excluir
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Modal Editar */}
        <Modal isOpen={modalEditar}>
          <ModalHeader>Editar Venda</ModalHeader>
          <ModalBody>
            <div className="form-group">
              <label>ID:</label>
              <input
                type="text"
                className="form-control"
                readOnly
                value={vendaSelecionada.id}
              />
              <label>Produto:</label>
              <input
                type="text"
                className="form-control"
                name="produto"
                onChange={handleChange}
                value={vendaSelecionada.produto}
              />
              <label>Quantidade:</label>
              <input
                type="number"
                className="form-control"
                name="quantidade"
                onChange={handleChange}
                value={vendaSelecionada.quantidade}
              />
              <label>Valor (R$):</label>
              <input
                type="number"
                className="form-control"
                name="valor"
                step="0.01"
                onChange={handleChange}
                value={vendaSelecionada.valor}
              />
            </div>
          </ModalBody>
          <ModalFooter>
            <button className="btn btn-primary" onClick={vendasPut}>
              Editar
            </button>
            <button className="btn btn-danger" onClick={abrirFecharModalEditar}>
              Cancelar
            </button>
          </ModalFooter>
        </Modal>

        {/* Modal Excluir */}
        <Modal isOpen={modalExcluir}>
          <ModalBody>
            Confirma a exclusão desta venda: {vendaSelecionada.produto}?
          </ModalBody>
          <ModalFooter>
            <button className="btn btn-danger" onClick={vendasDelete}>
              Sim
            </button>
            <button className="btn btn-secondary" onClick={abrirFecharModalExcluir}>
              Não
            </button>
          </ModalFooter>
        </Modal>
      </div>
    </div>
  );
}

export default App;
