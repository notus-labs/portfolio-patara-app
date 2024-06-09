import { ArrowDown, CaretDown, Info } from "@phosphor-icons/react";

export const DCA = () => {
  return (
    <div className="mt-1 flex h-full w-full items-center justify-center">
      <div className="w-full max-w-[480px] rounded-lg bg-custom-gray-50 p-4">
        <div className="flex flex-row items-center justify-between">
          <div className="text-sm font-semibold">Dollar Cost Averaging</div>
          <div className="flex flex-row gap-2">
            <div className="flex items-center justify-center rounded-lg border border-custom-gray-75 p-1 text-center text-xs text-custom-black">
              25%
            </div>
            <div className="flex items-center justify-center rounded-lg border border-custom-gray-75 p-1 text-center text-xs text-custom-black">
              50%
            </div>
            <div className="flex items-center justify-center rounded-lg border border-custom-gray-75 p-1 text-center text-xs text-custom-black">
              75%
            </div>
            <div className="flex items-center justify-center rounded-lg border border-custom-gray-75 p-1 text-center text-xs text-custom-black">
              MAX
            </div>
          </div>
        </div>
        <div className="mt-4 flex flex-col">
          <div className="flex flex-col gap-1 rounded-lg bg-custom-gray-75 p-4 py-3">
            <div className="text-right text-sm font-medium text-custom-gray-600">
              Sell
            </div>
            <div className="flex flex-row justify-between">
              {/* Coin select button */}
              <button className="flex flex-row items-center gap-2 rounded-full border border-custom-gray-100 bg-custom-gray-50 p-2">
                <div className="text-base font-semibold text-custom-black">
                  Select Token
                </div>
                <CaretDown className="h-5 w-5 text-custom-black" />
              </button>
              {/* Amount input */}
              <input
                className="w-1/2 rounded-lg bg-transparent p-2 pr-0 text-right text-2xl text-custom-black placeholder:text-custom-gray-600 focus:outline-none focus:ring-0"
                placeholder="Amount"
                maxLength={12}
              />
            </div>
            <div className="text-right text-sm text-custom-black">
              $1.0645945
            </div>
          </div>
          <div className="relative flex h-2 place-content-center items-center justify-center">
            <button className="absolute flex h-12 w-12 items-center justify-center rounded-full border-[3px] border-custom-gray-50 bg-custom-gray-100">
              <ArrowDown className="h-6 w-6 text-custom-black" />
            </button>
          </div>
          <div className="flex flex-col gap-1 rounded-lg bg-custom-gray-75 p-4 py-3">
            <div className="text-right text-sm font-medium text-custom-gray-600">
              Buy
            </div>
            <div className="flex flex-row justify-between">
              {/* Coin select button */}
              <button className="flex flex-row items-center gap-2 rounded-full border border-custom-gray-100 bg-custom-gray-50 p-2">
                <div className="text-base font-semibold text-custom-black">
                  Select Token
                </div>
                <CaretDown className="h-5 w-5 text-custom-black" />
              </button>
              {/* Amount input */}
              <input
                className="w-1/2 rounded-lg bg-transparent p-2 pr-0 text-right text-2xl text-custom-black placeholder:text-custom-gray-600 focus:outline-none focus:ring-0"
                placeholder="0"
                maxLength={12}
                disabled
              />
            </div>
            <div className="text-right text-sm text-custom-black">$222</div>
          </div>
        </div>
        <div className="mt-2 flex flex-col gap-2">
          <div className="grid grid-cols-2 gap-2">
            <div className="flex flex-col gap-2 rounded-lg bg-custom-gray-75 p-4 py-3">
              <div className="text-sm font-medium text-custom-gray-600">
                Every
              </div>
              <div className="flex flex-row justify-between">
                <input
                  className="w-1/4 rounded-lg bg-transparent p-2 pl-0 text-2xl text-custom-black placeholder:text-custom-gray-600 focus:outline-none focus:ring-0"
                  placeholder="0"
                  maxLength={12}
                />
                <div>
                  <button className="flex flex-row items-center gap-2 rounded-lg border border-custom-gray-100 bg-custom-gray-50 px-3 py-2 font-semibold">
                    <span className="text-sm text-custom-black">Minute</span>
                    <CaretDown className="h-5 w-5 text-custom-black" />
                  </button>
                </div>
              </div>
            </div>
            <div className="flex flex-col gap-2 rounded-lg bg-custom-gray-75 p-4 py-3">
              <div className="text-sm font-medium text-custom-gray-600">
                Over
              </div>
              <div className="flex flex-row justify-between">
                <input
                  className="w-1/4 rounded-lg bg-transparent p-2 pl-0 text-2xl text-custom-black placeholder:text-custom-gray-600 focus:outline-none focus:ring-0"
                  placeholder="0"
                  maxLength={2}
                />
                <div>
                  <div className="flex flex-row items-center gap-1 rounded-lg border border-custom-gray-100 bg-custom-gray-50 px-3 py-2 font-semibold">
                    <span className="text-sm text-custom-black">Orders</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-2">
            <div className="flex flex-col gap-2 rounded-lg bg-custom-gray-75 p-4 py-3">
              <div className="text-sm font-medium text-custom-gray-600">
                Min Price
              </div>
              <div className="flex flex-row justify-between">
                <input
                  className="w-3/4 rounded-lg bg-transparent p-2 pl-0 text-2xl text-custom-black placeholder:text-custom-gray-600 focus:outline-none focus:ring-0"
                  placeholder="0"
                  maxLength={9}
                />
              </div>
            </div>
            <div className="flex flex-col gap-2 rounded-lg bg-custom-gray-75 p-4 py-3">
              <div className="text-sm font-medium text-custom-gray-600">
                Max Price
              </div>
              <div className="flex flex-row justify-between">
                <input
                  className="w-3/4 rounded-lg bg-transparent p-2 pl-0 text-2xl text-custom-black placeholder:text-custom-gray-600 focus:outline-none focus:ring-0"
                  placeholder="0"
                  maxLength={9}
                />
              </div>
            </div>
          </div>
          <div className="flex flex-row items-center justify-between rounded-lg border border-custom-gray-100 p-2 px-4">
            <div className="text-sm font-medium text-custom-gray-600">
              Current buy SUI rate
            </div>
            <div className="text-right text-xs text-custom-black">
              $1.03654 SUI/USDC
            </div>
          </div>
          <div className="flex flex-row items-center gap-2 rounded-lg bg-custom-gray-100 p-2 px-4">
            <Info className="h-10 w-10 text-custom-black" />
            <div className="text-sm font-normal text-custom-gray-600">
              DCA will only be executed if the price falls within
              <br className="hidden sm:block" /> the range of your pricing
              strategy.
            </div>
          </div>
          <button className="w-full rounded-lg bg-primary-50 py-5 text-center text-base font-semibold text-primary-500">
            Start DCA
          </button>
        </div>
      </div>
    </div>
  );
};
