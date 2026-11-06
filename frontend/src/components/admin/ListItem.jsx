import { Box, Typography, Avatar, IconButton, Chip } from '@mui/material';
import RemoveIcon from '@mui/icons-material/Remove';
import EditIcon from '@mui/icons-material/Edit';

const ListItem = ({ data, fields, onDelete, onEdit, onStatusChange }) => {
  const title = data[fields.titleKey];
  const subtitle = fields.subtitleKey ? data[fields.subtitleKey] : null;
  const image = fields.imageKey ? data[fields.imageKey] : null;
  const extraFields = fields.extraKeys || [];
  const statusKey = fields.statusKey;

  const statusColors = {
    pending: 'warning',
    paid: 'success',
    shipped: 'info',
    cancelled: 'error'
  };

  return (
    <Box
      sx={{
        width: "75vw",
        minHeight: 70,
        bgcolor: "background.main",
        border: 1,
        borderColor: 'lightgrey',
        p: 2,
        borderRadius: 3,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        '&:hover': { boxShadow: 3 }
      }}
    >

      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, minWidth: 250, maxWidth: 300 }}>
        <Avatar
          src={image ? `/api/images${image}` : null}
          variant='square'
          sx={{ width: 60, height: 60, flexShrink: 0 }}
        >
          {!image && String(title)?.charAt(0)}
        </Avatar>

        <Box sx={{ minWidth: 0 }}>
          <Typography
            variant='h6'
            sx={{ fontWeight: 'bold', textTransform: 'capitalize', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}
          >
            {title}
          </Typography>
          {subtitle && (
            <Typography variant='body2' color="text.secondary" noWrap>
              {subtitle}
            </Typography>
          )}
        </Box>
      </Box>

      <Box sx={{ display: 'flex', alignItems: 'center', gap: 3, minWidth: 300, maxWidth: 400, flexWrap: 'nowrap', overflow: 'hidden' }}>
        {extraFields.map(field => {
          let value = data[field.key];
          if (field.type === 'price') value = `$${value}`;
          if (field.type === 'date') value = new Date(value).toLocaleDateString();
          return (
            <Typography key={field.key} variant='body2' sx={{ fontWeight: 500, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
              {field.label}: {value}
            </Typography>
          );
        })}
      </Box>

      {statusKey && data[statusKey] && (
        <Chip
          label={data[statusKey]}
          color={statusColors[data[statusKey]] || 'default'}
          size="small"
          sx={{ fontWeight: 600, cursor: 'pointer' }}
          onClick={() => {
            const nextStatusMap = {
              pending: "paid",
              paid: "shipped",
              shipped: "cancelled",
              cancelled: "pending"
            };
            const newStatus = nextStatusMap[data[statusKey]];
            if (onStatusChange) {
              onStatusChange(newStatus);
            }
          }}
        />
      )}




      <Box sx={{ display: 'flex', gap: 1, ml: 2 }}>
        {onDelete &&
          <IconButton onClick={onDelete} sx={{ bgcolor: 'contrast.main', width: 40, height: 40 }}>
            <RemoveIcon sx={{ color: 'white' }} />
          </IconButton>
        }
        {onEdit &&
          <IconButton onClick={onEdit} sx={{ bgcolor: 'contrast.main', width: 40, height: 40 }}>
            <EditIcon sx={{ color: 'white' }} />
          </IconButton>
        }


      </Box>
    </Box>
  );
};

export default ListItem;
