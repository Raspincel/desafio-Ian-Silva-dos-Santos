import items from './items.js'

class CaixaDaLanchonete {

    pedido = []
    modificadorDoPreco = 1

    pegarPedido(itens) {

        this.pedido = itens.map(item => {
            
            const pedido = item.split(',')
            const codigo = pedido[0]
            const quantidade = Number(pedido[1])
            
            const preco = (()=> {
                for (const item of items) {
                    if (item.code === codigo)
                        return item.price
                }
            })()

            return {
                codigo: codigo,
                quantidade: quantidade,
                preco: preco
            }
        });
    }

    possuiExtrasValidos() {
        const verificacao = (principal, extra)=> {
            return this.pedido.some(item => item.codigo === extra) && !this.pedido.some(item => item.codigo === principal)
        }

        if (verificacao('cafe', 'chantily'))
            return false

        if (verificacao('sanduiche', 'queijo'))
            return false

        return true
    }

    pediuQuantidadeValida() {
        return !this.pedido.some(item => { 
            return item.quantidade === 0
        })
    }

    inseriuCodigoValido() {
        const codigos = new Set()
        items.forEach(item => codigos.add(item.code))

        return this.pedido.every(item => codigos.has(item.codigo))
    }

    inseriuFormaDePagamentoValida(metodoDePagamento) {
        const formas = ["dinheiro", "debito", "credito"]
        return formas.includes(metodoDePagamento)
    }

    pegarModificadorDoPreco(metodoDePagamento) {
        if (metodoDePagamento === "dinheiro")
            this.modificadorDoPreco = 0.95
        
        if (metodoDePagamento === "credito")
            this.modificadorDoPreco = 1.03
    }

    calcularValorDaCompra(metodoDePagamento, itens) {
        
        if (itens.length === 0)
            return "Não há itens no carrinho de compra!"
        
        this.pegarPedido(itens)
        
        if (!this.pediuQuantidadeValida())
            return "Quantidade inválida!"

        if (!this.inseriuCodigoValido()) 
            return "Item inválido!"

        if (!this.possuiExtrasValidos())
            return "Item extra não pode ser pedido sem o principal"

        if (!this.inseriuFormaDePagamentoValida(metodoDePagamento))
            return "Forma de pagamento inválida!"

        this.pegarModificadorDoPreco(metodoDePagamento)

        const valorBase = this.pedido.reduce((acc, item)=> {
            return acc + (item.preco * item.quantidade)
        }, 0)

        const valor = (valorBase * this.modificadorDoPreco).toFixed(2).replace('.', ',')

        return `R$ ${valor}`;
    }
}

export { CaixaDaLanchonete };