export function usePhotoStackSummon() {
  const summonGen = useState("photo-stack:summon-gen", () => 0);
  const pendingSummon = useState("photo-stack:pending", () => false);
  const invokeSummon = useState<(() => void) | null>("photo-stack:invoke", () => null);

  function registerSummonHandler(handler: () => void) {
    invokeSummon.value = handler;
    if (pendingSummon.value) {
      handler();
      pendingSummon.value = false;
    }
  }

  function unregisterSummonHandler() {
    invokeSummon.value = null;
  }

  function requestPhotoStackSummon() {
    summonGen.value += 1;
    if (invokeSummon.value) {
      invokeSummon.value();
    } else {
      pendingSummon.value = true;
    }
  }

  return {
    summonGen,
    registerSummonHandler,
    unregisterSummonHandler,
    requestPhotoStackSummon,
  };
}
