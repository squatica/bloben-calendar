import { Button, Spinner, Text } from '@chakra-ui/react';
import { Context, StoreContext } from '../../context/store';
import { useContext } from 'react';

const Toast = () => {
  const [store]: [StoreContext] = useContext(Context);

  return (
    <>
      {store.isSyncingServer ? (
        <div style={{ zIndex: 99, position: 'fixed', left: '40%', top: 60 }}>
          <Button
            leftIcon={<Spinner />}
            colorScheme="pink"
            variant="solid"
            style={{
              boxShadow:
                '0 1px 3px rgba(0,0,0,0.12), 0 1px 2px rgba(0,0,0,0.24)',
              width: 120,
            }}
          >
            <Text style={{ marginLeft: 6, marginRight: 4 }}>Syncing</Text>
          </Button>
        </div>
      ) : null}
    </>
  );
};

export default Toast;
