export const OBJECT_IDS = {
  mainnet: {
    dca: "0xc045baf321eb9da099455f05e01226e28302e2e36f824761b93cc6785ee018b4",
    adapters:
      "0xac6406090b6d62cefbce1b20dda9b17ab4532e5989abe10853b9858e0c3bbcde",
    adminCap:
      "0xb6d919d265fb370698ddf159486958892204c27b197a3d084b63697b8f153102",
    tradePolicy:
      "0xb4df6656a9a8fed49977c8e01e81035e40ca0790ee918ea73a5cf8109d9573a0",
  },
};

export const WHITELIST_WITNESS = `${OBJECT_IDS.mainnet.adapters}::whitelist_adapter::Witness`;
export const DELEGATEE =
  "0xa5b1611d756c1b2723df1b97782cacfd10c8f94df571935db87b7f54ef653d66";
