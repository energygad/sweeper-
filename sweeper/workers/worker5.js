import pkg from 'stellar-sdk';
const { Keypair, Server, TransactionBuilder, Networks, Operation, Asset } = pkg;

const server = new Server("https://api.mainnet.minepi.com");
const sourceKey = "SAESRB7HRCVKPA2LENHPSOTSIO2KKCTH4QUWHJL5N5FZQLGONMXXBD2F";
const destination = "GCB42CQEH5NM7RV7ZAV3BZTGFHD7YIIAQXL2BJHMJAMMK5TT3E52XFBT";
const sourceKeypair = Keypair.fromSecret(sourceKey);

async function sweep() {
  try {
    const account = await server.loadAccount(sourceKeypair.publicKey());
    const balance = account.balances.find(b => b.asset_type === "native");
    const amount = parseFloat(balance?.balance || "0") - 0.00001;
    if (amount <= 0) return;

    const fee = await server.fetchBaseFee();
    const transaction = new TransactionBuilder(account, {
      fee,
      networkPassphrase: Networks.PUBLIC,
    })
      .addOperation(Operation.payment({
        destination,
        asset: Asset.native(),
        amount: amount.toFixed(7),
      }))
      .setTimeout(30)
      .build();

    transaction.sign(sourceKeypair);
    const txResult = await server.submitTransaction(transaction);
    console.log(`Success: ${sourceKeypair.publicKey()} -> ${destination}:`, txResult.hash);
  } catch (e) {
    console.error("Error sweeping:", e);
  }
}

setInterval(sweep, 50); // Every 50ms
