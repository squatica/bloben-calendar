import { Context } from '../../context/store';
import { Link, Text } from '@chakra-ui/react';
import ChakraModal from '../chakraCustom/ChakraModal';
import React, { useContext } from 'react';
import Separator from 'components/separator/Separator';
interface NewVersionModalProps {
  handleClose: any;
}
const NewVersionModal = (props: NewVersionModalProps) => {
  const [store] = useContext(Context);

  const { version, isDark } = store;

  const { handleClose } = props;

  return (
    <ChakraModal
      isOpen={true}
      handleClose={handleClose}
      minWidth={350}
      title={`New version available ${String(version.lastVersion)}`}
    >
      <>
        <Text>
          {/*@ts-ignore*/}
          Your current version {version.dockerImageVersion} is outdated.
        </Text>
        <Separator height={24} />
        <Text>
          To update version, run script update.sh in root directory. For more,
          visit{' '}
          <Link
            _focus={{ boxShadow: 'none' }}
            target={'_blank'}
            color={isDark ? 'pink.300' : 'pink.500'}
            href={'https://docs.bloben.com/docs/updates'}
          >
            update instructions
          </Link>
        </Text>
        <Separator height={24} />
        <Link
          _focus={{ boxShadow: 'none' }}
          target={'_blank'}
          color={isDark ? 'pink.300' : 'pink.500'}
          href={
            'https://github.com/nibdo/bloben-app/blob/production/CHANGELOG.md'
          }
        >
          Changelog
        </Link>
      </>
    </ChakraModal>
  );
};

export default NewVersionModal;
