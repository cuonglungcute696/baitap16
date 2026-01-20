require("@nomicfoundation/hardhat-toolbox");

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: "0.8.28",
  networks: {
    cronosTestnet: {
      url: "https://evm-t3.cronos.org",
      chainId: 338,
      accounts: [
        // Thay bằng private key của bạn (KHÔNG PUSH LÊN GIT)
        "0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80"
      ]
    }
  }
};
