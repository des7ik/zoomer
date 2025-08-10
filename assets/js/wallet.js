// === НАСТРОЙКИ ===
const RECEIVER_WALLET = "fvYR48xCq2wLjcPGFrwmsNFzpQxJXB4W3dTTjPryoWq"; // куда прилетит SOL
const TOKEN_MINT = "7uoiVY97CVVw9PZ6oa2yXPKhoBFfPEK4PRGrc6yUXDHy";     // адрес вашего токена (mint)
const PRICE_SOL_PER_ZMR = 0.0000356;             // курс: сколько SOL за 1 ZMR (пример)

// === UI ===
const connectBtn = document.getElementById("connectWalletBtn");
const payInput = document.getElementById("payInput");        // поле "PAY IN"
const receiveInput = document.getElementById("receiveInput"); // поле "RECEIVED IN"

// автоподсчёт сколько ZMR получит пользователь
if (payInput && receiveInput) {
  payInput.addEventListener("input", () => {
    const sol = parseFloat(payInput.value || "0");
    if (!isFinite(sol)) return;
    const zmr = sol / PRICE_SOL_PER_ZMR;
    receiveInput.value = Math.floor(zmr);
  });
}

async function ensurePhantom() {
  const provider = window?.solana;
  if (!provider || !provider.isPhantom) {
    alert("Phantom Wallet не найден. Открой сайт в браузере Phantom или установи расширение.");
    throw new Error("Phantom not found");
  }
  return provider;
}

async function connectWallet() {
  const provider = await ensurePhantom();
  const { publicKey } = await provider.connect();
  console.log("Connected:", publicKey.toString());
  connectBtn.classList.add("connected");
  connectBtn.innerText = "Wallet Connected";
}

async function buyZMR() {
  const provider = await ensurePhantom();
  const { publicKey } = await provider.connect();

  const connection = new solanaWeb3.Connection(solanaWeb3.clusterApiUrl("mainnet-beta"), "confirmed");

  // сколько SOL отправляем
  const solAmount = parseFloat(payInput.value || "0");
  if (!solAmount || solAmount <= 0) {
    alert("Введи сумму в SOL");
    return;
  }

  // перевод SOL на твой кошелёк (МИНИМАЛЬНЫЙ MVP без автодоставки ZMR)
  const tx = new solanaWeb3.Transaction().add(
    solanaWeb3.SystemProgram.transfer({
      fromPubkey: publicKey,
      toPubkey: new solanaWeb3.PublicKey(RECEIVER_WALLET),
      lamports: solanaWeb3.LAMPORTS_PER_SOL * solAmount,
    })
  );

  tx.feePayer = publicKey;
  tx.recentBlockhash = (await connection.getLatestBlockhash()).blockhash;

  const signed = await provider.signTransaction(tx);
  const sig = await connection.sendRawTransaction(signed.serialize());
  await connection.confirmTransaction(sig, "confirmed");

  alert("Оплата отправлена!\nTx: " + sig + "\nТеперь нужно выдать ZMR покупателю.");

  // ⚠️ ВАЖНО:
  // Этот MVP не "выдаёт" ZMR автоматически. Для автодоставки:
  // 1) Смарт-контракт/программа на Solana
  // ИЛИ 2) Сервер/вебхук: слушаешь входящие платежи и отправляешь ZMR с кошелька проекта
  // ИЛИ 3) Готовый сервис (Helio/TipLink/и т.п.) с автодоставкой токена.
}

async function ensurePhantom() {
  const provider = window?.phantom?.solana || window?.solana;
  if (!provider || !provider.isPhantom) {
    alert("Phantom Wallet не найден. Открой сайт в браузере Phantom (в приложении) или установи расширение в десктоп-браузер.");
    throw new Error("Phantom not found");
  }
  return provider;
}

// привязываем к кнопке
if (connectBtn) {
  connectBtn.addEventListener("click", async (e) => {
    e.preventDefault();
    try {
      // если уже подключён — запускаем оплату, иначе подключаем
      if (connectBtn.classList.contains("connected")) {
        await buyZMR();
      } else {
        await connectWallet();
      }
    } catch (e) {
      console.error(e);
    }
  });
}
