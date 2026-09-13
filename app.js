const palavras = ["IGOR","DEBUS","BEA","BEZZY","KAUAN","DANIEL","LOCUTORA","MATH","MATT","ZECA","ARTH","JOAO","LZN","MD","COOKIE","SNOW","FALL","COW","DAVI","RUDOLF","SOMBER","ZOLDY","GUS","MRX","SPX","NARG","EZ","XD","TACKOZ","VIRGULA","CARLOS","ZMATH","GYD","MAGICANDRE","YAS", "CALLERI","FABIX","ISA","SAGADO","VOLT","MAR","SILVA"];

const dados = JSON.parse(localStorage.getItem("dados"))??{
    versao_dados: 1,
    ultimo_jogo: '',
    resultado_ultimo_jogo: null,
    palavra_diaria: '',
    jogou_hoje: false,
    dias_jogados: 0,
    palavras_acertadas: 0,
    pontuacao: 0
};

const hoje = obter_data_hoje();

if(hoje != dados.ultimo_jogo){
    dados.ultimo_jogo = hoje;
    dados.jogou_hoje = false;

    let indexSorteado = Math.floor(Math.random()*palavras.length);
    dados.palavra_diaria = palavras[indexSorteado];

    localStorage.setItem("dados", JSON.stringify(dados));
}


if(!dados.jogou_hoje){
    exibir_mensagem("sobre");
}else{
    exibir_mensagem(dados.resultado_ultimo_jogo);
    desativar_digitacao();
}
    //     Q: "neutro",
    //     W: "neutro",
    //     E: "neutro",
    //     R: "neutro",
    //     T: "neutro",
    //     Y: "neutro",
    //     U: "neutro",
    //     I: "neutro",
    //     O: "neutro",
    //     P: "neutro",
    
    //     A: "neutro",
    //     S: "neutro",
    //     D: "neutro",
    //     F: "neutro",
    //     G: "neutro",
    //     H: "neutro",
    //     J: "neutro",
    //     K: "neutro",
    //     L: "neutro",
    
    //     Z: "neutro",
    //     X: "neutro",
    //     C: "neutro",
    //     V: "neutro",
    //     B: "neutro",
    //     N: "neutro",
    //     M: "neutro"
    // };
    
document.addEventListener("keydown", (event) => {
    if (event.key === "Enter") {
        verificar_tentativa();
    }
});

const inputPalavra = document.querySelector("#palavra-input");
let tentativasRestantes = 6;
let palavraDiaria = dados.palavra_diaria;

function verificar_tentativa(){
    let palavraSecreta = palavraDiaria.split("");
        
    let palavraOriginal = inputPalavra.value;
    inputPalavra.value = "";

    let palavraOriginalFormatada = formatar_palavra(palavraOriginal); 

    if(!palavras.includes(palavraOriginalFormatada)){
        return exibir_mensagem("nome_invalido");
    }

    let palavra = palavraOriginalFormatada.split("");

    let resultado = Array(palavra.length).fill("ERRADO");
    
    for(let i=0; i<palavraSecreta.length; i++){
        if(palavraSecreta[i] == palavra[i]){
            resultado[i] = "CORRETO";
            palavra[i] = "-";
            palavraSecreta[i] = "-";
        }
    }
    
    for(let i=0; i<palavra.length; i++){
        indexLetra = palavraSecreta.findIndex(letra => letra==palavra[i]);
        
        if(indexLetra != -1 && palavra[i] != "-"){
            resultado[i] = "QUASE";
            palavraSecreta[indexLetra] = "-";
        }
    }
    
    exibir_palavra(palavraOriginalFormatada, resultado);
    
    tentativasRestantes--;
    const tentativasHtml = document.querySelector("#tentativas");
    tentativasHtml.textContent = `Tentativas restantes: ${tentativasRestantes}`;

    if(palavraOriginalFormatada == palavraDiaria){
        dados.jogou_hoje = true;
        dados.dias_jogados++;
        dados.pontuacao += (tentativasRestantes*10);
        dados.palavras_acertadas++;
        dados.resultado_ultimo_jogo = "vitoria";
        
        localStorage.setItem("dados", JSON.stringify(dados));
        window.location.reload();
    }
    
    if(tentativasRestantes <= 0){
        dados.jogou_hoje = true;
        dados.dias_jogados += 1;
        dados.resultado_ultimo_jogo = "derrota";
        
        localStorage.setItem("dados", JSON.stringify(dados));
        window.location.reload();
    }
}

function formatar_palavra(palavra){
    return palavra.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toUpperCase();
}

function exibir_palavra(palavra, resultado){
    const nav = document.createElement("nav");
    nav.classList.add("palavra");

    for(let i=0; i<palavra.length; i++){
        const p = document.createElement("p");
        p.classList.add("letra");
        p.textContent = palavra[i];
        p.classList.add(resultado[i].toLowerCase());

        nav.appendChild(p);
    }

    const quadroPalavras = document.querySelector("#quadro-palavras");
    quadroPalavras.appendChild(nav);
}

function obter_data_hoje(){
    const dataHora = new Date();
    const dia = dataHora.getDate()+1;
    const mes = dataHora.getMonth()+1;
    const ano = dataHora.getFullYear();

    return `${dia}.${mes}.${ano}`;
}

function exibir_mensagem(mensagem){
    document.querySelector("#overlay").style.display = "flex";
    const cardMensagem = document.querySelector("#card-mensagem");
    cardMensagem.style.display = "flex";

    let conteudo;
    if(mensagem == "sobre"){
        conteudo = `<h1>Sobre</h1>
        <p>- Descubra a palavra do membro da Collectors em até 6 tentativas. <br>
        - Ao digitar una palavra, se a letra estiver verde🟢, então a letra está no lugar certo.<br>
        - Se estiver amarelo🟡, a letra pertence a palavra, mas está na posição errada. <br>
        - Apenas uma tentativa por dia.
        </p>
        <button onclick="fechar_mensagem()">Continuar</button>`;

    }else if(mensagem == "vitoria"){
        conteudo = `<h1>Você acertou!!!</h1>
        <p>Você acertou a palavra do dia, volte amanhã para jogar novamente.</p>
        <p>
            🔡 Palavra do dia: ${dados.palavra_diaria} <br>
            📅 Dias jogados: ${dados.dias_jogados} <br>
            🎯 Palavras acertadas: ${dados.palavras_acertadas} <br>
            🎰 Pontuação: ${dados.pontuacao}
        </p>
        <button onclick="fechar_mensagem()">Continuar</button>`;

    }else if(mensagem == "derrota"){
        conteudo = `<h1>Você errou!!!</h1>
        <p>Você errou a palavra do dia, volte amanhã para tentar novamente.</p>
        <p>
            🔡 Palavra do dia: ${dados.palavra_diaria} <br>
            📅 Dias jogados: ${dados.dias_jogados} <br>
            🎯 Palavras acertadas: ${dados.palavras_acertadas} <br>
            🎰 Pontuação: ${dados.pontuacao}
        </p>
        <button onclick="fechar_mensagem()">Continuar</button>`;
    
    }else if(mensagem == "nome_invalido"){
        conteudo = `<h1>❌ Erro</h1>
        <p>Palavra digitada não está no banco de dados ou não foi digitada corretamente.</p>
        <button onclick="fechar_mensagem()">Continuar</button>`;
    }

    cardMensagem.innerHTML = conteudo;
}
    
function fechar_mensagem(){
    document.querySelector("#overlay").style.display = "none";
    document.querySelector("#card-mensagem").style.display = "none";
}

function desativar_digitacao(){
    document.querySelector("#palavra-input").disabled = true;
    document.querySelector("#btn-enviar-tentativa").onclick = () => window.location.reload();
}