import { Tooltip, Badge } from "@chakra-ui/react";

const AmalanStatusIcon = ({ status }: { status: string }) => {

  let colorScheme = "gray";
  let label = "Tidak Diketahui";

  switch (status) {
    case "active":
      colorScheme = "green";
      label = "Aktif";
      break;
    case "inactive":
      colorScheme = "gray";
      label = "Tidak Aktif";
      break;
    case "archived":
      colorScheme = "orange";
      label = "Diarsipkan";
      break;
  }

  return (
    <Tooltip label={label} hasArrow>
    <Badge
      colorScheme={colorScheme}
      fontSize="xs"
      borderRadius="sm"
    >
      {label}
    </Badge>
  </Tooltip>
  );
};

export default AmalanStatusIcon;
