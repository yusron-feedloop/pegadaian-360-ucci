import React, { useState, useEffect, useRef } from "react";
import {
  Box,
  Container,
  HStack,
  FormControl,
  FormLabel,
  Input,
  Text,
  Textarea,
  Button,
  Select,
} from "@chakra-ui/react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { v4 as uuidv4 } from "uuid";
import { dateTime } from "../../libs/date-time";

const AppointmentPage: React.FC = () => {
  const [places, setPlaces] = useState([]);
  const [populatedAreas, setPopulatedAreas] = useState([]);
  const [populatedCabang, setPopulatedCabang] = useState([]);
  const [tickets, setTickets] = useState([]);
  //
  const [isSaturday, setIsSaturday] = useState(false);
  // data
  const [startDate, setStartDate] = useState(null);
  const [time, setTime] = useState(null);
  const [ticketId, setTicketId] = useState(null);
  const [nik, setNik] = useState("");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [kanwil, setKanwil] = useState("");
  const [area, setArea] = useState("");
  const [cabang, setCabang] = useState("");
  const [description, setDescription] = useState("");
  const [jenisKeluhan, setJenisKeluhan] = useState("-");
  const ticketElRef = useRef(null);
  const kanwilSelect = useRef<HTMLSelectElement>();

  const isValid = () => {
    return (
      nik.length > 0 &&
      // name.length > 0 &&
      // phone.length > 0 &&
      time != null &&
      kanwil.length > 0 &&
      area.length > 0 &&
      cabang.length > 0
    );
  };

  const autoFill = () => {
    const tiketId = ticketElRef.current.value;
    const selected = tickets.filter((v) => v.tiketId == tiketId);

    if (selected.length > 0) {
      setNik(selected[0].nik);
      setName(selected[0].nama);
      setPhone(selected[0].phoneNumber);
      setEmail(selected[0].email);
      setJenisKeluhan(selected[0].jenisKeluhan);
    }
  };

  const populateArea = (val) => {
    places.forEach((place) => {
      if (place.code == val) {
        setKanwil(val);

        // sort and save
        place.area.sort((a, b) => {
          return a.name.localeCompare(b.name);
        });

        setPopulatedAreas(place.area);

        //reset populated cabang
        setPopulatedCabang([]);

        // reset previous selected cabang
        setArea("");

        return;
      }
    });
  };

  const populateCabang = (val) => {
    places.forEach((place) => {
      place.area.forEach((_area) => {
        if (_area.code == val) {
          setArea(val);

          // sort and save
          _area.cabang.sort((a, b) => {
            return a.name.localeCompare(b.name);
          });
          setPopulatedCabang(_area.cabang);

          return;
        }
      });
    });
  };

  const changeDate = (date) => {
    setStartDate(date);

    setIsSaturday(date.getDay() == 6);
  };

  const saveData = () => {
    const aixpTracker = require("aixp-node-sdk");
    const client = new aixpTracker(
      process.env.NEXT_PUBLIC_WRITE_KEY,
      process.env.NEXT_PUBLIC_DATA_PLANE_URL + "/v1/batch"
    );

    let reservedDate = dateTime(startDate).format("YYYY-MM-DD");

    let newDate = new Date(reservedDate);
    newDate = new Date(
      newDate.toLocaleString("en-US", { timeZone: "Asia/Jakarta" })
    );
    let reservedStartTime: string = null,
      reservedEndTime: string = null;

    switch (time) {
      case 0:
        reservedStartTime = reservedDate + " 00:30:00";
        reservedEndTime = reservedDate + " 04:30:00";
        break;

      case 1:
        reservedStartTime = reservedDate + " 06:00:00";
        reservedEndTime = reservedDate + " 08:00:00";
        break;

      case 2:
        reservedStartTime = reservedDate + " 00:30:00";
        reservedEndTime = reservedDate + " 06:00:00";
        break;
    }

    let namaKanwil = places.find((v) => v.code == kanwil).name;
    let namaArea = populatedAreas.find((v) => v.code == area).name;
    let namaCabang = populatedCabang.find((v) => v.code == cabang).name;

    client.track(
      {
        event: "submitReservasiCc",
        anonymousId: uuidv4(),
        messageId: "api-" + uuidv4(),
        originalTimestamp: new Date().getTime(),
        sentAt: new Date().getTime(),
        type: "track",
        properties: {
          reservasiTanggal: dateTime(startDate).format("YYYY-MM-DD"),
          reservasiWaktuAwal: reservedStartTime,
          reservasiWaktuAkhir: reservedEndTime,
          tujuanReservasi: description,
          idReservasi: uuidv4(),
          jenisKeluhan,
          namaKanwil,
          namaArea,
          namaCabang,
        },
        context: {
          traits: {
            nik,
            // namaLengkap: name,
            // phoneNumber: phone,
            // kodeOutlet: cabang,
            // email,
            // namaKanwil,
            // namaArea,
            // namaCabang,
          },
        },
      },
      () => {
        const Swal = require("sweetalert2");

        // reset data
        setStartDate(null); // BUGGY, COMING FROM ITS LIBRARY?
        setIsSaturday(new Date().getDay() == 6); // BUGGY, COMING FROM ITS LIBRARY?
        setTime("");
        setNik("");
        setName("");
        setPhone("");
        setEmail("");
        setKanwil("");
        setArea("");
        setCabang("");
        setDescription("");
        setJenisKeluhan("");
        kanwilSelect.current.value = "";

        Swal.fire({
          title: "Berhasil",
          text: "Reservasi appointment berhasil dibuat",
          icon: "success",
        });
      }
    );
  };

  useEffect(() => {
    fetch("/api/areas", {
      headers: {
        "Content-type": "application/json",
      },
    })
      .then((response) => response.json())
      .then((response) => {
        let places_data = [];

        // fill kanwil
        response.forEach((_area) => {
          let already_pushed = false;
          places_data.forEach((place) => {
            if (place.name == _area.kanwil) {
              already_pushed = true;
              return;
            }
          });

          if (!already_pushed) {
            places_data.push({
              name: _area.kanwil,
              code: _area.kodewilayah,
              area: [],
            });
          }
        });

        // fill area
        places_data.forEach((place) => {
          response.forEach((_area) => {
            if (place.name == _area.kanwil) {
              let area_already_pushed = false;
              place.area.forEach((__area) => {
                if (__area.name == _area.area) {
                  area_already_pushed = true;
                  return;
                }
              });

              if (!area_already_pushed) {
                // fill cabang
                let cabang = [];
                response.forEach((cbg) => {
                  if (cbg.area == _area.area) {
                    cabang.push({
                      name: cbg.cabang,
                      code: cbg.kodeoutlet,
                    });
                  }
                });

                place.area.push({
                  name: _area.area,
                  code: _area.kodearea,
                  cabang,
                });
              }
            }
          });
        });

        // sort data ASCENDING
        places_data.sort(function (a, b) {
          return a.name.localeCompare(b.name);
        });

        setPlaces(places_data);
      });

    // list ticket
    fetch("/api/tickets", {
      headers: {
        "Content-type": "application/json",
      },
    })
      .then((response) => response.json())
      .then((response) => {
        setTickets(response.list);
      });
  }, []);

  return (
    <Box p="4">
      <Container maxW="container.xl">
        <Text fontSize="3xl" fontWeight="bold" textAlign="center" mb="5">
          RESERVASI OUTLET
        </Text>
        <Text
          textTransform="uppercase"
          textDecoration="underline"
          fontWeight="bold"
          mb="3"
        >
          identitas nasabah
        </Text>
        <FormControl mb="3">
          <FormLabel htmlFor="ticket_id">No. Tiket (opsional)</FormLabel>
          <Select onChange={autoFill} ref={ticketElRef}>
            <option value="">Pilih No Tiket</option>
            {tickets.map((ticket) => (
              <option value={ticket.tiketId} key={ticket.eventId}>
                {ticket.tiketId} ({ticket.nama})
              </option>
            ))}
          </Select>
          {/* <Input id='ticket_id' type='text' onChange={e => setTicketId(e.target.value)}/> */}
        </FormControl>
        <FormControl mb="3">
          <FormLabel htmlFor="nik">NIK</FormLabel>
          <Input
            id="nik"
            type="number"
            value={nik}
            onChange={(e) => setNik(e.target.value)}
          />
        </FormControl>
        {/* <FormControl mb="3">
          <FormLabel htmlFor="name">Nama Lengkap</FormLabel>
          <Input
            id="name"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </FormControl>
        <FormControl mb="3">
          <FormLabel htmlFor="phone_number">Email</FormLabel>
          <Input
            id="email"
            type="text"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </FormControl>
        <FormControl mb="3">
          <FormLabel htmlFor="phone_number">No. HP</FormLabel>
          <Input
            id="phone_number"
            type="text"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
          />
        </FormControl> */}

        <Text
          textTransform="uppercase"
          textDecoration="underline"
          fontWeight="bold"
          mb="3"
        >
          detail reservasi
        </Text>
        <Text mb="3">Pilih Tanggal</Text>
        <DatePicker
          selected={startDate}
          onChange={(date) => changeDate(date)}
          // highlightDates={[new Date()]}
          inline
        />

        <Text mb="3">Pilih Waktu</Text>
        <HStack alignContent="flex-start" justifyContent="flex-start" mb="3">
          <Button
            colorScheme="teal"
            variant={time === 0 ? "solid" : "outline"}
            onClick={() => setTime(0)}
            disabled={isSaturday}
          >
            07.30 - 11.30
          </Button>
          <Button
            colorScheme="teal"
            variant={time === 1 ? "solid" : "outline"}
            onClick={() => setTime(1)}
            disabled={isSaturday}
          >
            13.00 - 15.00
          </Button>
          <Button
            colorScheme="teal"
            variant={time === 2 ? "solid" : "outline"}
            onClick={() => setTime(2)}
            disabled={!isSaturday}
          >
            07.30 - 13.00
          </Button>
        </HStack>
        <Text>Pilih outlet kunjungan</Text>
        <Box border="1px solid #ccc" p="4" borderRadius="4" mb="3">
          <FormControl mb="3">
            <FormLabel htmlFor="email">Nama Kanwil</FormLabel>
            <Select
              onChange={(e) => populateArea(e.target.value)}
              ref={kanwilSelect}
            >
              <option value="">Pilih Kanwil</option>
              {places.map((place) => (
                <option value={place.code} key={place.code}>
                  {place.name}
                </option>
              ))}
            </Select>
          </FormControl>
          <FormControl mb="3">
            <FormLabel htmlFor="email">Nama Area</FormLabel>
            <Select
              onChange={(e) => populateCabang(e.target.value)}
              disabled={kanwil == ""}
              value={area}
            >
              <option value="">Pilih Area</option>
              {populatedAreas.map((place) => (
                <option value={place.code} key={place.code}>
                  {place.name}
                </option>
              ))}
            </Select>
          </FormControl>
          <FormControl mb="3">
            <FormLabel htmlFor="email">Nama Cabang</FormLabel>
            <Select
              onChange={(e) => setCabang(e.target.value)}
              disabled={area == ""}
              value={cabang}
            >
              <option value="">Pilih Cabang</option>
              {populatedCabang.map((place) => (
                <option value={place.code} key={place.code}>
                  {place.name}
                </option>
              ))}
            </Select>
          </FormControl>
        </Box>
        <FormControl mb="3">
          <FormLabel htmlFor="email">Tujuan Reservasi</FormLabel>
          <Textarea
            id="email"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </FormControl>
        <HStack>
          <Button
            colorScheme="green"
            onClick={() => saveData()}
            disabled={isValid() === false}
          >
            Simpan
          </Button>
          <Button colorScheme="gray">Batal</Button>
        </HStack>
      </Container>
    </Box>
  );
};

export default AppointmentPage;
